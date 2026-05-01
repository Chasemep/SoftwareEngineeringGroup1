/**
 * Parking Router — /parking
 *
 * GET /parking/:eventId — Return parking lots associated with an event
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// ─── GET /parking/:eventId ────────────────────────────────────────────────────
router.get('/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Verify the event exists
    const [[event]] = await db.query(
      'SELECT id, name, location, latitude, longitude FROM events WHERE id = ?',
      [eventId]
    );

    if (!event) {
      return res.status(404).json({ error: `Event with ID ${eventId} not found` });
    }

    // Fetch parking lots linked to this event
    const [lots] = await db.query(
      `SELECT
         p.id,
         p.name,
         p.location,
         p.distance_ft,
         p.walk_time_min,
         p.latitude,
         p.longitude,
         p.notes
       FROM parking_lots p
       WHERE p.event_id = ?
       ORDER BY p.distance_ft ASC`,
      [eventId]
    );

    // If no specific lots are linked, return general campus lots as fallback
    let parkingData = lots;
    if (lots.length === 0) {
      const [generalLots] = await db.query(
        `SELECT id, name, location, distance_ft, walk_time_min, latitude, longitude, notes
         FROM parking_lots
         WHERE event_id IS NULL
         ORDER BY distance_ft ASC
         LIMIT 5`
      );
      parkingData = generalLots;
    }

    res.json({
      event: { id: event.id, name: event.name, location: event.location },
      parking_lots: parkingData,
      count: parkingData.length,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
