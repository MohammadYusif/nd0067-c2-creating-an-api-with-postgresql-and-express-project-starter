import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password?: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT id, first_name, last_name FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT id, first_name, last_name FROM users WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error(`User with id ${id} not found`);
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get user ${id}: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO users (first_name, last_name, password) VALUES($1, $2, $3) RETURNING id, first_name, last_name';
      const hash = bcrypt.hashSync(
        (user.password || '') + (BCRYPT_PASSWORD || ''),
        parseInt(SALT_ROUNDS as string)
      );
      const result = await conn.query(sql, [
        user.first_name,
        user.last_name,
        hash
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create user ${user.first_name}: ${err}`);
    }
  }

  async authenticate(
    firstName: string,
    lastName: string,
    password: string
  ): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT id, first_name, last_name, password FROM users WHERE first_name=$1 AND last_name=$2';
      const result = await conn.query(sql, [firstName, lastName]);
      conn.release();

      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + (BCRYPT_PASSWORD || ''), user.password)) {
          return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name
          };
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Cannot authenticate user: ${err}`);
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        'DELETE FROM users WHERE id=$1 RETURNING id, first_name, last_name';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete user ${id}: ${err}`);
    }
  }
}
