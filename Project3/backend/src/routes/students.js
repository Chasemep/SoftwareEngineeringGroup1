/**
 * Students Router — /students
 *
 * POST /students/register        — Register a student for an event
 * GET  /students/:studentId      — Get student profile + their registrations
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateRegistration } = require('../middleware/validate');

// ─── POST /students/register ──────────────────────────────────────────────────
router.post('/register', validateRegistration, async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      first_name,
      middle_name = null,
      last_name,
      student_id,
      email = null,
      event_id,
    } = req.body;

    // 1. Verify the event exists
    const [[event]] = await conn.query('SELECT id, name, event_date FROM events WHERE id = ?', [event_id]);
    if (!event) {
      await conn.rollback();
      return res.status(404).json({ error: `Event with ID ${event_id} not found` });
    }

    // 2. Upsert student (find existing or create new)
    let studentDbId;
    const [[existingStudent]] = await conn.query(
      'SELECT id FROM students WHERE student_id = ?',
      [student_id]
    );

    if (existingStudent) {
      studentDbId = existingStudent.id;
    } else {
      const [insertResult] = await conn.query(
        `INSERT INTO students (first_name, middle_name, last_name, student_id, email)
         VALUES (?, ?, ?, ?, ?)`,
        [first_name, middle_name, last_name, student_id, email]
      );
      studentDbId = insertResult.insertId;
    }

    // 3. Prevent duplicate registration
    const [[duplicate]] = await conn.query(
      'SELECT id FROM registrations WHERE student_id = ? AND event_id = ?',
      [studentDbId, event_id]
    );
    if (duplicate) {
      await conn.rollback();
      return res.status(409).json({ error: 'Student is already registered for this event' });
    }

    // 4. Create the registration record
    const [regResult] = await conn.query(
      'INSERT INTO registrations (student_id, event_id) VALUES (?, ?)',
      [studentDbId, event_id]
    );

    await conn.commit();

    res.status(201).json({
      message: 'Registration successful',
      registration: {
        id: regResult.insertId,
        student_id: student_id,
        student_name: `${first_name}${middle_name ? ' ' + middle_name : ''} ${last_name}`,
        event_id: event.id,
        event_name: event.name,
        event_date: event.event_date,
        registered_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

// ─── GET /students/:studentId ─────────────────────────────────────────────────
router.get('/:studentId', async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Fetch student profile
    const [[student]] = await db.query(
      'SELECT id, first_name, middle_name, last_name, student_id, email FROM students WHERE student_id = ?',
      [studentId]
    );

    if (!student) {
      return res.status(404).json({ error: `Student with ID ${studentId} not found` });
    }

    // Fetch their registrations with event details
    const [registrations] = await db.query(
      `SELECT
         r.id AS registration_id,
         r.registered_at,
         e.id AS event_id,
         e.name AS event_name,
         e.description,
         e.event_date,
         e.cost,
         e.location
       FROM registrations r
       JOIN events e ON e.id = r.event_id
       WHERE r.student_id = ?
       ORDER BY e.event_date ASC`,
      [student.id]
    );

    res.json({ student, registrations });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
