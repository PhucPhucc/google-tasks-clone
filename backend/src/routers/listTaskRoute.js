import express from 'express'
import { createListTask, deleteListTaskById, getTasksByListId, getListTasks, updateListTaskById } from '../controllers/listTaskController.js';

const router = express.Router();

// route: /api/list 
router.get('/', getListTasks);

router.post('/', createListTask);

router.get('/:id/tasks', getTasksByListId);

router.patch('/:id', updateListTaskById);

router.delete('/:id', deleteListTaskById);

export default router;



