/**
 * Events Router — /events
 *
 * GET  /events          — List all events (sortable, filterable, searchable)
 * GET  /events/:id      — Get single event by ID
 * POST /events          — Create a new event (admin use)
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateEvent } = require('../middleware/validate');

// ─── GET /events ─────────────────────────────────────────────────────────────
// Query params: ?search=&date=YYYY-MM-DD&sort=date|name
router.get('/', async (req, res, next) => {
  try {
    const { search = '', date = '', sort = 'date' } = req.query;

    // Build dynamic WHERE clause
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(e.name LIKE ? OR e.description LIKE ? OR e.location LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (date) {
      conditions.push('DATE(e.event_date) = ?');
      params.push(date);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Determine sort order (whitelist to prevent SQL injection)
    const orderBy = sort === 'name' ? 'e.name ASC' : 'e.event_date ASC';

    const [rows] = await db.query(
      `SELECT
         e.id,
         e.name,
         e.description,
         e.event_date,
         e.cost,
         e.location,
         e.latitude,
         e.longitude,
         COUNT(r.id) AS registration_count
       FROM events e
       LEFT JOIN registrations r ON r.event_id = e.id
       ${where}
       GROUP BY e.id
       ORDER BY ${orderBy}`,
      params
    );

    res.json({ events: rows });
  } catch (err) {
    next(err);
  }
});

// ─── GET /events/:id ─────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [[event]] = await db.query(
      `SELECT e.*, COUNT(r.id) AS registration_count
       FROM events e
       LEFT JOIN registrations r ON r.event_id = e.id
       WHERE e.id = ?
       GROUP BY e.id`,
      [id]
    );

    if (!event) {
      return res.status(404).json({ error: `Event with ID ${id} not found` });
    }

    res.json({ event });
  } catch (err) {
    next(err);
  }
});

// ─── POST /events ─────────────────────────────────────────────────────────────
router.post('/', validateEvent, async (req, res, next) => {
  try {
    const { name, description = '', event_date, cost = 0.0, location, latitude = null, longitude = null } = req.body;

    const [result] = await db.query(
      `INSERT INTO events (name, description, event_date, cost, location, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, event_date, cost, location, latitude, longitude]
    );

    const [[created]] = await db.query('SELECT * FROM events WHERE id = ?', [result.insertId]);

    res.status(201).json({ event: created, message: 'Event created successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
