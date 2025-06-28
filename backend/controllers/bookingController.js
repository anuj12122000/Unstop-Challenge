const pool = require('../db');
const { calcTravelTime } = require('../utils/travelTime');

exports.bookRooms = async (req, res) => {
  const n = parseInt(req.body.count);
  if (!n || n < 1 || n > 5) return res.status(400).json({ error: "1-5 rooms only" });

  try {
    // First, try to find a floor with enough rooms
    const floorResult = await pool.query(`
      SELECT floor FROM rooms WHERE is_booked = false GROUP BY floor HAVING COUNT(*) >= $1 ORDER BY floor LIMIT 1
    `, [n]);

    if (floorResult.rowCount > 0) {
      const floor = floorResult.rows[0].floor;
      const rooms = await pool.query(
        `SELECT * FROM rooms WHERE is_booked = false AND floor = $1 ORDER BY position ASC LIMIT $2`,
        [floor, n]
      );
      await confirmBooking(rooms.rows);
      return res.json({ booked: rooms.rows });
    }

    // Fallback: Find best N rooms by travel time
    const allRooms = await pool.query(`SELECT * FROM rooms WHERE is_booked = false`);
    if (allRooms.rowCount < n) return res.status(400).json({ error: "Not enough rooms" });

    const rooms = allRooms.rows;
    let bestCombo = null, bestTime = Infinity;

    const combine = (start, path) => {
      if (path.length === n) {
        const t = calcTravelTime(path);
        if (t < bestTime) {
          bestTime = t;
          bestCombo = [...path];
        }
        return;
      }
      for (let i = start; i < rooms.length; i++) {
        combine(i + 1, [...path, rooms[i]]);
      }
    };
    combine(0, []);

    if (bestCombo) {
      await confirmBooking(bestCombo);
      return res.json({ booked: bestCombo });
    } else {
      return res.status(400).json({ error: "No valid room combination" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const confirmBooking = async (rooms) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const r of rooms) {
      await client.query('UPDATE rooms SET is_booked = true WHERE id = $1', [r.id]);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

exports.resetRooms = async (_, res) => {
  await pool.query('UPDATE rooms SET is_booked = false');
  res.json({ message: 'All rooms reset' });
};

exports.generateOccupancy = async (_, res) => {
  await pool.query(`UPDATE rooms SET is_booked = random() > 0.5`);
  res.json({ message: 'Random occupancy generated' });
};

exports.getAllRooms = async (_, res) => {
  const rooms = await pool.query('SELECT * FROM rooms ORDER BY floor, position');
  res.json(rooms.rows);
};
