import express from 'express'
import { createListTask, deleteListTaskById, getListTaskById, getListTasks, updateListTaskById } from '../controllers/listTaskController.js';

const router = express.Router();

// route: /api/list 
router.get('/', getListTasks);

router.post('/', createListTask);

router.get('/:id', getListTaskById);

router.patch('/:id', updateListTaskById);

router.delete('/:id', deleteListTaskById);

export default router;



