import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import { INotePayload } from 'src/types/types';
import NotFoundError from '../../exceptions/NotFoundError';
import AuthorizationError from '../../exceptions/AuthorizationError';
import mapDBToModel from '../../utils/index';
import CollaborationsService from './CollaborationsService';

export default class NotesService {
  private _pool: Pool;

  private _collaborationService: CollaborationsService;

  constructor(collaborationService: CollaborationsService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;

    this.addNote = this.addNote.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.getNoteById = this.getNoteById.bind(this);
    this.editNoteById = this.editNoteById.bind(this);
    this.deleteNoteById = this.deleteNoteById.bind(this);
    this.verifyNoteOwner = this.verifyNoteOwner.bind(this);
    this.verifyNoteAccess = this.verifyNoteAccess.bind(this);
  }

  async addNote({ title, body, tags, owner }: INotePayload) {
    const id = `note-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getNotes(owner: string) {
    const query = {
      text: `SELECT notes.* FROM notes
      LEFT JOIN collaborations ON collaborations.note_id = notes.id
      WHERE notes.owner = $1 OR collaborations.user_id = $1
      GROUP BY notes.id`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async getNoteById(id: string) {
    const query = {
      text: `SELECT notes.*, users.username
      FROM notes
      LEFT JOIN users ON users.id = notes.owner
      WHERE notes.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id: string, { title, body, tags }: INotePayload) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteNoteById(id: string) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyNoteOwner(id: string, owner: string) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyNoteAccess(noteId: string, userId: string) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}
