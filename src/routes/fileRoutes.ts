import express from 'express';
import { createFile, getFile, updateFile, deleteFile } from '../controllers/fileController';

const router = express.Router();

router.post('/files', createFile);
router.get('/files/:id', getFile);
router.put('/files/:id', updateFile);
router.delete('/files/:id', deleteFile);

export default router;
