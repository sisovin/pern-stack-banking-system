import { Request, Response } from 'express';
import db from '../config/database';
import { files, NewFile } from '../models/File';

export const createFile = async (req: Request, res: Response) => {
  try {
    const { name, type, size } = req.body;
    const newFile: NewFile = {
      name,
      type,
      size,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await db.insert(files).values(newFile).returning();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create file' });
  }
};

export const getFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await db.select().from(files).where({ id }).first();
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
};

export const updateFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, size } = req.body;
    const updatedFile = {
      name,
      type,
      size,
      updatedAt: Date.now(),
    };

    const result = await db.update(files).set(updatedFile).where({ id }).returning();
    if (!result) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update file' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.delete(files).where({ id }).returning();
    if (!result) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
