import Task from '../models/Task.js';
import TaskList from '../models/TaskList.js';

const requireTask = async (req, res, next) => {
  try {
    const { id: taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: 'Thiếu taskId trong params' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    const list = await TaskList.findById(task.taskListId);
    if (!list) {
      return res.status(404).json({ message: 'Không tìm thấy list' });
    }

    const user = req.user;
    if (!list.ownerId.equals(user._id)) {
      return res.status(403).json({
        message: 'Bạn không có quyền truy cập vào task này',
      });
    }

    req.task = task;
    req.taskList = list;

    next();
  } catch (error) {
    console.error('requireTask error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export default requireTask;
