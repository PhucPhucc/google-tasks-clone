import {
  createList,
  deleteListById,
  getListById,
  getListByUserId,
  updateListById,
} from '../services/listTaskService.js';

// == manage List Task ==
// api/list/
export const getListTasks = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(500).json({ message: 'không tìm thấy user' });

  const listResult = await getListByUserId(user._id);

  return res.status(listResult.status).json(listResult.list);
};

export const createListTask = async (req, res) => {
  const { title } = req.body;
  const user = req.user;
  if (!title || !user)
    return res.status(500).json({ message: 'không tìm thấy user hoặc title' });

  const listResult = await createList(user._id, title);

  return res.status(listResult.status).json(listResult);
};

export const getListTaskById = async (req, res) => {
  const { id: taskId } = req.params;
  if (!taskId)
    return res.status(500).json({ message: 'không tìm thấy title ID' });

  const listResult = await getListById(taskId);

  return res.status(listResult.status).json(listResult);
};

export const updateListTaskById = async (req, res) => {
  const { id: taskId } = req.params;
  const { title } = req.body;

  if (!taskId)
    return res.status(500).json({ message: 'không tìm thấy title ID' });

  const listResult = await updateListById(taskId, title);

  return res.status(listResult.status).json(listResult);
};

export const deleteListTaskById = async (req, res) => {
  const { id: taskId } = req.params;
  const user = req.user;

  if (!taskId || !user)
    return res.status(500).json({ message: 'không tìm thấy user hoặc title' });

  const delResult = await deleteListById(taskId, user._id);

  return res.status(delResult.status).json(delResult);
};

// == share List Task ==
