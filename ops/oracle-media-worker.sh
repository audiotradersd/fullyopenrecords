#!/usr/bin/env bash
# Claims and processes one job. A systemd timer runs this every minute.
set -Eeuo pipefail

CONFIG_FILE="${MEDIA_WORKER_CONFIG:-/etc/fullyopen-media-worker.env}"
[[ -r "$CONFIG_FILE" ]] || { echo "Missing $CONFIG_FILE" >&2; exit 1; }
# This is an administrator-owned, chmod 600 file.
# shellcheck disable=SC1090
source "$CONFIG_FILE"

for command in curl jq rclone ffmpeg ffprobe lftp flock; do command -v "$command" >/dev/null || { echo "Missing $command" >&2; exit 1; }; done
exec 9>/tmp/fullyopen-media-worker.lock
flock -n 9 || exit 0

api() { curl --fail-with-body --silent --show-error -H "Authorization: Bearer $MEDIA_PROCESSOR_TOKEN" -H "Content-Type: application/json" "$@"; }
payload="$(api -X POST "$API_BASE/media-worker/jobs/claim")"
job_id="$(jq -r '.job.id // empty' <<<"$payload")"
[[ -n "$job_id" ]] || exit 0

job_type="$(jq -r '.job.type' <<<"$payload")"
source_bucket="$(jq -r '.job.sourceBucket' <<<"$payload")"
source_key="$(jq -r '.job.sourceKey' <<<"$payload")"
master_key="$(jq -r '.job.masterKey // empty' <<<"$payload")"
output_key="$(jq -r '.job.outputKey // empty' <<<"$payload")"
title="$(jq -r '.job.song.title' <<<"$payload")"
artist="$(jq -r '.job.song.artistName' <<<"$payload")"
work_dir="$(mktemp -d /tmp/fullyopen-media.XXXXXX)"

fail_job() {
  local message="$1"
  api -X POST --data "$(jq -nc --arg error "$message" '{error:$error}')" "$API_BASE/media-worker/jobs/$job_id/fail" >/dev/null || true
}
trap 'status=$?; if (( status != 0 )); then fail_job "Media worker failed while processing job '$job_id'."; fi; rm -rf "$work_dir"' EXIT

if [[ "$job_type" == "encode" ]]; then
  [[ -n "$master_key" && -n "$output_key" ]] || { fail_job "Encode job is missing R2 keys."; exit 1; }
  # Legacy jobs start in the former public bucket. Archive the exact source in
  # private R2 before reading it for conversion.
  if [[ "$source_bucket" == "media" ]]; then
    rclone copyto "$R2_MEDIA_REMOTE/$source_key" "$R2_MASTERS_REMOTE/$master_key"
  fi
  rclone copyto "$R2_MASTERS_REMOTE/$master_key" "$work_dir/master"
  ffmpeg -y -i "$work_dir/master" -map 0:a:0 -map_metadata 0 \
    -c:a libmp3lame -b:a 128k -ar 44100 -ac 2 -id3v2_version 3 \
    -metadata title="$title" -metadata artist="$artist" "$work_dir/preview.mp3"
  duration="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$work_dir/preview.mp3" | awk '{printf "%d", $1}')"
  rclone copyto "$work_dir/preview.mp3" "$R2_MEDIA_REMOTE/$output_key"
  api -X POST --data "$(jq -nc --argjson duration "${duration:-0}" '{duration:$duration}')" "$API_BASE/media-worker/jobs/$job_id/complete" >/dev/null
elif [[ "$job_type" == "radio_upload" ]]; then
  rclone copyto "$R2_MEDIA_REMOTE/$source_key" "$work_dir/radio-preview.mp3"
  # citrus3.lftp must contain connection settings and open/login only; it must
  # not contain ls, put, or bye commands.
  lftp -f "$LFTP_CONFIG" -e "put -O \"$CITRUS_REMOTE_DIR\" \"$work_dir/radio-preview.mp3\"; bye"
  api -X POST --data '{}' "$API_BASE/media-worker/jobs/$job_id/complete" >/dev/null
else
  fail_job "Unknown job type: $job_type"
  exit 1
fi
