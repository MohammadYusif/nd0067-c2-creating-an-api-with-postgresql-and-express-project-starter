import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../middleware/auth';

dotenv.config();

const store = new UserStore();
const { TOKEN_SECRET } = process.env;

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.show(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };

    if (!user.first_name || !user.last_name || !user.password) {
      res.status(400).json({
        error: 'Missing required fields: first_name, last_name, password'
      });
      return;
    }

    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, TOKEN_SECRET as string);
    res.json({ user: newUser, token });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, password } = req.body;

    if (!first_name || !last_name || !password) {
      res.status(400).json({
        error: 'Missing required fields: first_name, last_name, password'
      });
      return;
    }

    const user = await store.authenticate(first_name, last_name, password);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ user }, TOKEN_SECRET as string);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const userRoutes = (app: express.Application): void => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
};

export default userRoutes;
