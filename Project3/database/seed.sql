-- ============================================================
-- PNW Student Life Event Management System
-- Seed Data — Events & Parking
-- Based on pnw.edu/events/category/student-life/
-- ============================================================

USE pnw_events;

-- ─── Sample Events ────────────────────────────────────────────────────────────
INSERT INTO events (name, description, event_date, cost, location, latitude, longitude) VALUES
(
  'Welcome Week Kickoff BBQ',
  'Kick off the new semester with free food, lawn games, and campus resource fair. Meet student organizations and get involved on campus!',
  '2025-08-25 11:00:00', 0.00,
  'Student Union and Library Building (SULB) Outdoor Patio, Hammond Campus',
  41.58448, -87.47421
),
(
  'Campus Clubs & Organizations Fair',
  'Discover over 100 student clubs and organizations. Sign up for the ones that interest you and connect with your future co-members.',
  '2025-09-05 10:00:00', 0.00,
  'Anderson Hall Lawn, 2200 169th St, Hammond, IN 46323',
  41.58781, -87.47532
),
(
  'PNW Homecoming Pep Rally',
  'Show your Peregrines pride! Live music, food trucks, giveaways, and a pep rally sendoff before the big game.',
  '2025-10-10 18:00:00', 0.00,
  'Porter Hall Plaza, Hammond Campus',
  41.58531, -87.47310
),
(
  'Fall Career & Internship Fair',
  'Connect with 80+ employers actively recruiting PNW students and alumni. Bring your resume and dress professionally.',
  '2025-10-15 10:00:00', 0.00,
  'Student Union and Library Building (SULB), Ballroom, Hammond Campus',
  41.58448, -87.47421
),
(
  'Diwali Cultural Celebration',
  'Celebrate the Festival of Lights with traditional food, music, dance performances, and rangoli art. All are welcome!',
  '2025-11-01 17:00:00', 0.00,
  'Lawshe Hall Auditorium, Hammond Campus',
  41.58309, -87.47532
),
(
  'Thanksgiving Dinner — Student Life',
  'Enjoy a free Thanksgiving dinner with your fellow Peregrines. No one eats alone during the holidays!',
  '2025-11-20 12:00:00', 0.00,
  'Fitness and Recreation Center Multipurpose Room, Hammond Campus',
  41.578056, -87.474444
),
(
  'Finals Week Stress Relief Fair',
  'De-stress before finals! Therapy dogs, free snacks, yoga mini-sessions, and mindfulness activities.',
  '2025-12-08 13:00:00', 0.00,
  'Gyte Building Lobby, Hammond Campus',
  41.58559, -87.47504
),
(
  'Spring Welcome Social',
  'Start the spring semester right. Free pizza, campus tours for new students, and raffle prizes.',
  '2026-01-12 11:30:00', 0.00,
  'Student Union and Library Building (SULB) Atrium, Hammond Campus',
  41.58448, -87.47421
),
(
  'Black History Month Film Screening',
  'Screening of an award-winning documentary followed by a facilitated discussion. Popcorn provided.',
  '2026-02-05 19:00:00', 0.00,
  'Nils K. Nelson Bioscience Innovation Building, Room 150, Hammond Campus',
  41.58305, -87.47480
),
(
  'Leadership Summit',
  'A full-day workshop for student leaders. Topics include conflict resolution, project management, and inclusive leadership. Lunch included.',
  '2026-03-21 08:30:00', 15.00,
  'Powers Building, Conference Center, Hammond Campus',
  41.58642, -87.47532
);

-- ─── General Campus Parking Lots (event_id = NULL) ───────────────────────────
INSERT INTO parking_lots (name, location, event_id, distance_ft, walk_time_min, latitude, longitude, notes) VALUES
(
  '169th Street Parking Lot',
  '169th Street, Hammond Campus',
  NULL, 300, 2,
  41.58664, -87.47429,
  'Large surface lot on the north edge of campus. Free with valid PNW permit.'
),
(
  '169th Street Parking Garage',
  'Wicker Ave & 171st St, Hammond Campus',
  NULL, 600, 4,
  41.58530, -87.47213,
  'Multi-level parking garage. Permits required. Accessible elevator on Level 1.'
),
(
  'North 173rd Street Parking',
  'N 173rd St, Hammond Campus',
  NULL, 800, 6,
  41.58168, -87.47541,
  'South-campus surface lot near Lawshe and Nils buildings.'
),
(
  'Wicker Avenue North Parking',
  'Wicker Ave, Hammond Campus',
  NULL, 900, 7,
  41.58687, -87.47181,
  'East-side surface lot. Open to all permit holders.'
),
(
  'University Village Parking',
  '173rd St, Hammond Campus',
  NULL, 1200, 9,
  41.57998, -87.47178,
  'Resident parking area — visitor spaces available on east side.'
);

-- ─── Event-Specific Parking Suggestions ──────────────────────────────────────
-- Welcome Week BBQ  (event_id = 1) → near SULB
INSERT INTO parking_lots (name, location, event_id, distance_ft, walk_time_min, latitude, longitude, notes) VALUES
(
  'North 173rd Street Parking (SULB Access)',
  'N 173rd St, Hammond Campus',
  1, 400, 3,
  41.58168, -87.47541,
  'Closest lot to SULB Outdoor Patio. Enter from 173rd Street.'
),
(
  '169th Street Parking Lot (SULB Overflow)',
  '169th Street, Hammond Campus',
  1, 700, 5,
  41.58664, -87.47429,
  'Additional overflow parking on the north side.'
);

-- Leadership Summit (event_id = 10) → near Powers Building
INSERT INTO parking_lots (name, location, event_id, distance_ft, walk_time_min, latitude, longitude, notes) VALUES
(
  '169th Street Parking Lot (Powers Access)',
  '169th Street, Hammond Campus',
  10, 250, 2,
  41.58664, -87.47429,
  'Recommended lot for Powers Building events. Enter from 169th St.'
);
