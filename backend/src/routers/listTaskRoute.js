import express from 'express';
import {
  createListTask,
  deleteListTaskById,
  getTasksByListId,
  getListTasks,
  updateListTaskById,
} from '../controllers/listTaskController.js';
import requireListTask from '../middlewares/listTaskMiddleware.js';

const router = express.Router();

// route: /api/list
router.get('/', getListTasks);

router.post('/', createListTask);

router.get('/:id/tasks', requireListTask, getTasksByListId);

router.patch('/:id', requireListTask, updateListTaskById);

router.delete('/:id', requireListTask, deleteListTaskById);

export default router;
