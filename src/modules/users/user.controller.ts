import { Request, Response } from 'express';
import { findAllUsers, findUserById } from './user.service.js';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await findAllUsers();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
};