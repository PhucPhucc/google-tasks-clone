import { createNewTaskService, getAllTaskService } from '../services/taskService.js';

export const getAllTasks = async (req, res) => {
  const user = req.user;
  const tasks = await getAllTaskService(user._id);
  console.log(tasks);
  return res.status(tasks.status).json(tasks);
};

export const createTask = async (req, res) => {
  try {
    // 1. Gọi Service và truyền dữ liệu cần thiết
    const newTask = await createNewTaskService(req.user._id, req.body);

    // 2. Trả về thành công
    res.status(201).json(newTask);
  } catch (error) {
    // 3. Xử lý lỗi từ Service ném ra
    if (error.message === 'TASK_LIST_NOT_FOUND') {
      return res.status(404).json({
        message: 'Danh sách không tồn tại hoặc bạn không có quyền truy cập',
      });
    }

    // Các lỗi không xác định (Lỗi hệ thống)
    console.error('Create Task Error:', error);
    res.status(500).json({ message: 'Lỗi Server khi tạo công việc' });
  }
};
export const updateTask = async (req, res) => {};

export const updateStatus = async (req, res) => {};
export const deleteTask = async (req, res) => {};
