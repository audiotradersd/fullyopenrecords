CREATE TABLE IF NOT EXISTS artist_engagement_campaigns (
  campaign_id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  template_alias TEXT NOT NULL,
  subject TEXT NOT NULL,
  priority INTEGER NOT NULL CHECK (priority BETWEEN 0 AND 5),
  category TEXT NOT NULL,
  theme TEXT NOT NULL,
  eligibility_description TEXT NOT NULL,
  min_repeat_days INTEGER NOT NULL DEFAULT 45,
  enabled INTEGER NOT NULL DEFAULT 1,
  is_event INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artist_engagement_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active','inactive','archived')),
  schedule_group TEXT NOT NULL DEFAULT 'production',
  current_revision INTEGER NOT NULL DEFAULT 1,
  timezone TEXT NOT NULL DEFAULT 'Europe/London',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activated_at TEXT,
  deactivated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS artist_engagement_one_active_schedule_idx
  ON artist_engagement_schedules(schedule_group) WHERE status='active';

CREATE TABLE IF NOT EXISTS artist_engagement_schedule_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schedule_id INTEGER NOT NULL REFERENCES artist_engagement_schedules(id) ON DELETE CASCADE,
  revision INTEGER NOT NULL,
  name_snapshot TEXT NOT NULL,
  timezone TEXT NOT NULL,
  slots TEXT NOT NULL,
  active_from TEXT,
  active_to TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(schedule_id, revision)
);
CREATE INDEX IF NOT EXISTS artist_engagement_schedule_active_period_idx
  ON artist_engagement_schedule_revisions(active_from, active_to);

CREATE TABLE IF NOT EXISTS artist_engagement_daily_schedules (
  local_date TEXT NOT NULL,
  schedule_group TEXT NOT NULL DEFAULT 'production',
  timezone TEXT NOT NULL,
  schedule_id INTEGER NOT NULL REFERENCES artist_engagement_schedules(id),
  schedule_revision INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(local_date,schedule_group)
);

CREATE TABLE IF NOT EXISTS artist_engagement_daily_decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  local_date TEXT NOT NULL,
  timezone TEXT NOT NULL,
  schedule_id INTEGER NOT NULL,
  schedule_revision INTEGER NOT NULL,
  candidates TEXT NOT NULL,
  selected_campaign_id TEXT,
  selected_slot_id TEXT,
  selected_send_at TEXT,
  winner_reason TEXT,
  status TEXT NOT NULL,
  revalidated_at TEXT,
  revalidation_reason TEXT,
  send_history_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(artist_id, local_date)
);
CREATE INDEX IF NOT EXISTS artist_engagement_daily_decision_date_idx
  ON artist_engagement_daily_decisions(local_date, status);

CREATE TABLE IF NOT EXISTS artist_engagement_eligibility (
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL,
  first_qualified_at TEXT NOT NULL,
  last_evaluated_at TEXT NOT NULL,
  currently_eligible INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(artist_id, campaign_id)
);

INSERT OR IGNORE INTO artist_engagement_campaigns
  (campaign_id,name,template_alias,subject,priority,category,theme,eligibility_description,min_repeat_days,enabled,is_event)
VALUES
 ('music-01','The World Wants to Hear You','music-01','The world wants to hear you',1,'nurture','music-start','No tracks uploaded yet.',14,1,0),
 ('music-02','We''ve Heard the First Ones','music-02','We''ve heard the first ones. What else have you got?',1,'nurture','music-next','One or two tracks uploaded.',14,1,0),
 ('catalogue-01','Bring More of Your World','catalogue-01','Bring more of your world',2,'nurture','catalogue','Three to nine tracks; encourage a broader catalogue.',60,1,0),
 ('bio-01','Tell the World About Yourself','bio-01','Tell the world about yourself',4,'nurture','profile-bio','Artist bio is missing.',60,1,0),
 ('image-01','Put a Face to the Music','image-01','Put a face to the music',4,'nurture','profile-image','Artist profile image is missing.',60,1,0),
 ('release-01','Got an EP or Album?','release-01','Got an EP or album?',2,'nurture','release','Has tracks but no album or release.',60,1,0),
 ('version-01','Working on a Song Right Now?','version-01','Working on a song right now?',2,'nurture','version-control','Has tracks but no Track Version Control history.',60,1,0),
 ('version-02','Don''t Lose the Good Bits','version-02','Don''t lose the good bits',3,'nurture','version-control','Has versions, none added in the last 45 days.',90,1,0),
 ('gig-01','Playing Anywhere Soon?','gig-01','Playing anywhere soon?',3,'nurture','live-shows','No future gigs listed.',60,1,0),
 ('gig-02','What''s Next?','gig-02','What''s next?',3,'nurture','live-shows','Has past gigs but no future gigs.',60,1,0),
 ('video-01','Got Something Worth Watching?','video-01','Got something worth watching?',3,'nurture','video','No artist videos listed.',60,1,0),
 ('photo-01','Show Us More','photo-01','Show us more',5,'nurture','photos','No gallery photos listed.',75,1,0),
 ('social-01','Help People Find You Everywhere','social-01','Help people find you everywhere',4,'nurture','social-links','One or fewer social/music links.',75,1,0),
 ('press-01','Got Something People Have Said About You?','press-01','Got something people have said about you?',5,'nurture','press','No press/features listed.',90,1,0),
 ('return-01','Come Back In','return-01','Come back in — there''s more to see',2,'nurture','return','No reliable historic login baseline; currently not eligible.',90,0,0),
 ('return-02','Come See What''s Happening','return-02','Come see what''s happening',2,'nurture','return','Last successful login 30–89 days ago.',90,1,0),
 ('return-03','Look What''s Been Happening','return-03','Look what''s been happening',2,'nurture','return','Last successful login at least 90 days ago.',120,1,0),
 ('fresh-01','What Are You Making at the Moment?','fresh-01','What are you making at the moment?',3,'nurture','fresh-work','No content added or updated in 45 days.',60,1,0),
 ('firsttrack-01','You''re In','firsttrack-01','You''re in',1,'nurture','first-track','Exactly one track, uploaded in the last three days.',36500,1,0),
 ('active-01','Now Look What Else You Can Do','active-01','Now look what else you can do',3,'nurture','next-features','At least three tracks added in the last 30 days.',90,1,0),
 ('listen-01','People Are Listening','listen-01','People are listening',2,'positive','listener-traction','At least 100 recorded plays; disabled until reliable play telemetry exists.',30,0,0),
 ('tracklisten-01','This One''s Getting Heard','tracklisten-01','This one''s getting heard',2,'positive','track-traction','At least 25 plays on a track; disabled until reliable play telemetry exists.',30,0,0),
 ('invite-01','Know Someone Making Great Music?','invite-01','Know someone making great music?',4,'nurture','invite','At least three tracks and account older than 30 days.',180,1,0),
 ('share-01','Your Fully Open Page Is Made to Be Shared','share-01','Your Fully Open page is made to be shared',3,'nurture','share','Has music and at least one useful page detail.',30,1,0),
 ('disc-01','Put Your Music in the Room','disc-01','Put your music in the room',2,'nurture','discovery','Has at least one track.',90,1,0),
 ('radio-edu-01','How Music Gets on Fully Open Radio','radio-edu-01','How music gets on Fully Open Radio',3,'nurture','radio-education','Has at least one track.',120,1,0),
 ('feature-01','We Just Built This','feature-01','We just built this',4,'nurture','feature-launch','Matches an active Fully Open feature opportunity.',90,1,0),
 ('vinyl-opp-01','Next Fully Open Vinyl Opportunity','vinyl-opp-01','We''re putting together the next Fully Open vinyl',0,'positive','vinyl-opportunity','Matches a real, active vinyl opportunity requiring artist contact.',36500,1,1),
 ('radio-new-01','Something New Is Playing','radio-new-01','Something new is playing',3,'nurture','radio-news','Matches an active Fully Open Radio announcement.',90,1,0),
 ('whatson-01','What''s Happening at Fully Open','whatson-01','What''s happening at Fully Open',4,'nurture','fully-open-roundup','Matches an active Fully Open event or roundup.',90,1,0),
 ('radio-selected-01','Radio Selection','radio-selected-01','Your music has been selected for Fully Open Radio',0,'positive','radio-selection','New genuine Radio selection event.',36500,1,1),
 ('feature-selected-01','Featured Artist Selection','feature-selected-01','We''ve chosen your music for a Fully Open feature',0,'positive','feature-selection','New genuine Featured Artist selection event.',36500,1,1);

INSERT OR IGNORE INTO artist_engagement_campaigns
  (campaign_id,name,template_alias,subject,priority,category,theme,eligibility_description,min_repeat_days,enabled,is_event)
VALUES
 ('checkin-01','Fully Open Check-In','checkin-01','A note from Fully Open',4,'nurture','general-checkin','Contactable artist has had no ordinary engagement contact for 60 days and no more relevant currently eligible campaign applies.',60,1,0);

INSERT INTO artist_engagement_schedules (id,name,status,current_revision,timezone,created_at,updated_at,activated_at)
VALUES (1,'Default','active',1,'Europe/London',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO artist_engagement_schedule_revisions
  (schedule_id,revision,name_snapshot,timezone,slots,active_from,created_at)
VALUES (1,1,'Default','Europe/London',
 '[{"id":"mon-photo","campaignId":"photo-01","day":1,"time":"10:30","enabled":true,"priorityOverride":null},{"id":"mon-version","campaignId":"version-01","day":1,"time":"18:30","enabled":true,"priorityOverride":null},{"id":"tue-music","campaignId":"music-02","day":2,"time":"10:30","enabled":true,"priorityOverride":null},{"id":"tue-video","campaignId":"video-01","day":2,"time":"19:00","enabled":true,"priorityOverride":null},{"id":"wed-music","campaignId":"music-01","day":3,"time":"10:30","enabled":true,"priorityOverride":null},{"id":"wed-release","campaignId":"release-01","day":3,"time":"19:00","enabled":true,"priorityOverride":null},{"id":"thu-catalogue","campaignId":"catalogue-01","day":4,"time":"10:30","enabled":true,"priorityOverride":null},{"id":"thu-gig","campaignId":"gig-01","day":4,"time":"19:00","enabled":true,"priorityOverride":null},{"id":"fri-firsttrack","campaignId":"firsttrack-01","day":5,"time":"10:30","enabled":true,"priorityOverride":null},{"id":"fri-share","campaignId":"share-01","day":5,"time":"19:00","enabled":true,"priorityOverride":null},{"id":"sat-return","campaignId":"return-02","day":6,"time":"10:30","enabled":true,"priorityOverride":null},{"id":"sat-invite","campaignId":"invite-01","day":6,"time":"19:00","enabled":true,"priorityOverride":null},{"id":"sun-return","campaignId":"return-03","day":7,"time":"10:30","enabled":true,"priorityOverride":null},{"id":"sun-press","campaignId":"press-01","day":7,"time":"19:00","enabled":true,"priorityOverride":null}]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

UPDATE artist_engagement_schedule_revisions
SET slots=replace(slots,'"id":"sun-press","campaignId":"press-01"','"id":"sun-checkin","campaignId":"checkin-01"')
WHERE schedule_id=1 AND revision=1;
