INSERT OR IGNORE INTO editorial_slots (slot_key, title, description, active)
VALUES ('artists_grid', 'Artists grid', 'Curated artists page cards', 1);

DELETE FROM editorial_slot_items WHERE slot_id = (SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid');

INSERT INTO editorial_slot_items (slot_id, item_type, item_id, sort_order, active) VALUES
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 322, 0, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 248, 1, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 284, 2, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 119, 3, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 89, 4, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 54, 5, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 171, 6, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 279, 7, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 12, 8, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 142, 9, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 270, 10, 1),
((SELECT id FROM editorial_slots WHERE slot_key = 'artists_grid'), 'song', 15, 11, 1);
