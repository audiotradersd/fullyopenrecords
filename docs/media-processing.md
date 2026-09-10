# Private master and public MP3 processing

Artist master uploads are placed in `fully-open-records-masters`, a private R2 bucket. Oracle claims an encode job, preserves the master, produces a metadata-preserving 128 kbps MP3, and uploads that preview to `fully-open-records-media`. Only the preview gets a public `/media/` URL.

## One-time Cloudflare setup

From `workers/api`, create the private bucket and apply the migration:

```bash
npx wrangler r2 bucket create fully-open-records-masters
npx wrangler d1 execute fully-open-records-db --remote --file ../../infra/migrations/0027_media_processing.sql
npx wrangler secret put MEDIA_PROCESSOR_TOKEN
npx wrangler deploy
```

Use a long random value for `MEDIA_PROCESSOR_TOKEN`, then store the same value in `/etc/fullyopen-media-worker.env` on Oracle. It must never be committed or pasted into chat.

Create a second Rclone S3 remote, `r2-masters`, scoped to `fully-open-records-masters`. The existing `r2-media` remote needs read/write access to `fully-open-records-media`.

## Oracle setup

```bash
sudo apt install -y jq
sudo install -m 755 ops/oracle-media-worker.sh /usr/local/bin/fullyopen-media-worker
sudo install -m 644 ops/fullyopen-media-worker.service /etc/systemd/system/
sudo install -m 644 ops/fullyopen-media-worker.timer /etc/systemd/system/
sudo install -m 600 ops/oracle-media-worker.env.example /etc/fullyopen-media-worker.env
sudo nano /etc/fullyopen-media-worker.env
sudo systemctl daemon-reload
sudo systemctl enable --now fullyopen-media-worker.timer
sudo systemctl start fullyopen-media-worker.service
```

`/home/ubuntu/citrus3.lftp` must retain its secure credentials and connection/open directives, but remove its test `ls`, `put`, and `bye` lines. The worker supplies the upload command itself.

## Existing tracks

In the admin Radio page, use **Archive and encode existing tracks** once. It queues only R2-managed tracks that do not already have an archived master. Oracle copies each legacy source into private R2, encodes it, switches the song's public audio URL to the MP3, then the API removes the old publicly available master.
