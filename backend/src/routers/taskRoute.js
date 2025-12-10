import express from 'express';
import requireTask from '../middlewares/taskMiddleware.js';

import {
  getAllTasks,
  createTask,
  updateTask,
  updateStatus,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

// api/tasks
router.get('/', getAllTasks);

router.post('/', createTask);

router.patch('/:id', requireTask, updateTask);

router.patch('/:id/status', requireTask, updateStatus);

router.delete('/:id', requireTask, deleteTask);

// share user
// router.patch('/:id/assign', requireTask, getTasks);

export default router;