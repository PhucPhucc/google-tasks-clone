import TaskList from '../models/TaskList.js';

const requireListTask = async (req, res, next) => {
  try {
    const { id: listId } = req.params;

    if (!listId) {
      return res.status(400).json({ message: 'Thiếu listId trong params' });
    }

    const list = await TaskList.findById(listId);
    if (!list) {
      return res.status(403).json({ message: 'không tìm thấy list' });
    }

    const user = req.user;
    if (!list.ownerId.equals(user._id)) {
      return res
        .status(401)
        .json({ message: 'bạn không có quyền truy cập vào list này' });
    }

    req.taskList = list;

    next();
  } catch (error) {}
};

export default requireListTask;
