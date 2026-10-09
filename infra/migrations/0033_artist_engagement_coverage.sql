ALTER TABLE artist_engagement_email_history ADD COLUMN template_alias TEXT;

INSERT OR IGNORE INTO artist_engagement_campaigns
  (campaign_id,name,template_alias,subject,priority,category,theme,eligibility_description,min_repeat_days,enabled,is_event)
VALUES
  ('checkin-01','Fully Open Check-In','checkin-01','A note from Fully Open',4,'nurture','general-checkin','Contactable artist has had no ordinary engagement contact for 60 days and no more relevant currently eligible campaign applies.',60,1,0);
