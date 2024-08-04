import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../../exceptions/InvariantError';

export default class CollaborationsService {
  private _pool: Pool;

  constructor() {
    this._pool = new Pool();

    this.addCollaboration = this.addCollaboration.bind(this);
    this.deleteCollaboration = this.deleteCollaboration.bind(this);
    this.verifyCollaborator = this.verifyCollaborator.bind(this);
  }

  async addCollaboration(noteId: string, userId: string) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) Returning id',
      values: [id, noteId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(noteId: string, userId: string) {
    const query = {
      text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  async verifyCollaborator(noteId: string, userId: string) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}
