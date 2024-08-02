import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { IUser } from 'src/types/types';
import InvariantError from '../../exceptions/InvariantError';
import NotFoundError from '../../exceptions/NotFoundError';

export default class UsersService {
  private _pool: Pool;

  constructor() {
    this._pool = new Pool();

    this.addUser = this.addUser.bind(this);
    this.verifyNewUsername = this.verifyNewUsername.bind(this);
    this.getUserById = this.getUserById.bind(this);
  }

  async addUser({ username, password, fullname }: IUser) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username: string) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.'
      );
    }
  }

  async getUserById(userId: string) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }
}
