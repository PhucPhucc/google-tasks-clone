import {
  clearCompletedTasksService,
  createNewTaskService,
  getAllTaskService,
  updateTaskService,
} from "../services/taskService.js";

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
    if (error.message === "TASK_LIST_NOT_FOUND") {
      return res.status(404).json({
        message: "Danh sách không tồn tại hoặc bạn không có quyền truy cập",
      });
    }

    // Các lỗi không xác định (Lỗi hệ thống)
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Lỗi Server khi tạo công việc" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = req.task;
    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = req.task;

    const newTask = await updateTaskService(task, req.body);

    return res.status(200).json({ newTask });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const task = req.task;
    const { isCompleted } = req.body;
    if (typeof isCompleted !== "boolean" || isCompleted === null) {
      return res.status(400).json({
        message: "isCompleted phải là kiểu boolean hoac kh duoc null",
      });
    }
    task.isCompleted = isCompleted;
    await task.save();

    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const toggleImportant = async (req, res) => {
  try {
    const task = req.task;
    task.isImportant = !task.isImportant;
    await task.save();

    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const moveTask = async (req, res) => {
  try {
    const task = req.task;
    const { targetTaskListId } = req.body;

    if (!targetTaskListId) {
      return res.status(400).json({ message: "targetTaskListId bị thiếu" });
    }

    // Kiểm tra xem danh sách công việc đích có tồn tại và thuộc về người dùng không
    const targetTaskList = await TaskList.findOne({
      _id: targetTaskListId,
      ownerId: req.user._id,
    });
    if (!targetTaskList) {
      return res
        .status(404)
        .json({ message: "Danh sách công việc đích không tồn tại" });
    }
    task.taskListId = targetTaskListId;
    await task.save();

    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = req.task;
    await task.remove();
    return res.status(200).json({ message: "Xóa công việc thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const clearCompletedTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskListId } = req.body;

    if (!taskListId) {
      return res.status(400).json({ message: "taskListId bị thiếu" });
    }
    
    // Xóa tất cả công việc đã hoàn thành trong danh sách công việc cụ thể
    const deletedCount = await clearCompletedTasksService(userId, taskListId);

    return res.status(200).json({
      message: `Đã xóa ${deletedCount.deletedCount} công việc đã hoàn thành`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};
