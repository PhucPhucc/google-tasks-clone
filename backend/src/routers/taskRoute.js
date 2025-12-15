import express from 'express';
import requireTask from '../middlewares/taskMiddleware.js';

import {
  getAllTasks,
  createTask,
  getTaskById, 
  updateTask,
  updateStatus,
  deleteTask,
  toggleImportant,
  moveTask, 
  clearCompletedTasks,
} from '../controllers/taskController.js';

const router = express.Router();

// Lấy danh sách (đã có)
router.get('/', getAllTasks); 

// Tạo mới (đã có)
router.post('/', createTask);

// Lấy chi tiết Task
router.get('/:id', requireTask, getTaskById); 

// Cập nhật chung (đã có)
router.patch('/:id', requireTask, updateTask);

// Cập nhật trạng thái Hoàn thành (đã có)
router.patch('/:id/status', requireTask, updateStatus);

// Đánh dấu Quan trọng (API mới)
router.patch('/:id/important', requireTask, toggleImportant); 

// Di chuyển Task sang danh sách khác (API mới)
router.patch('/:id/move', requireTask, moveTask); 

// Xóa Task (đã có)
router.delete('/:id', requireTask, deleteTask);

// Xóa tất cả công việc đã hoàn thành trong một danh sách
router.delete('/clear-completed', clearCompletedTasks); 

export default router;