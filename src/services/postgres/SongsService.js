const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO songs (id, title, year, performer, genre, duration, albumId)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let baseQuery = "SELECT id, title, performer FROM songs";
    const conditions = [];
    const values = [];

    if (title) {
      values.push(`%${title.toLowerCase()}%`);
      conditions.push(`LOWER(title) LIKE $${values.length}`);
    }

    if (performer) {
      values.push(`%${performer.toLowerCase()}%`);
      conditions.push(`LOWER(performer) LIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    const result = await this._pool.query({ text: baseQuery, values });
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * FROM songs WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError("Lagu tidak ditemukan");

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: `UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6
             WHERE id = $7 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount)
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount)
      throw new NotFoundError("Gagal menghapus lagu. Id tidak ditemukan");
  }
}

module.exports = SongsService;
