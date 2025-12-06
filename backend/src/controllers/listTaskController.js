import {
  createList,
  deleteListById,
  getTasks,
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

export const getTasksByListId = async (req, res) => {
  const { id: listId } = req.params;
  if (!listId)
    return res.status(500).json({ message: 'không tìm thấy list ID' });

  const tasksResult = await getTasks(listId);

  return res.status(tasksResult.status).json(tasksResult);
};

export const updateListTaskById = async (req, res) => {
  const { id: listId } = req.params;
  const { title } = req.body;

  if (!listId)
    return res.status(500).json({ message: 'không tìm thấy title ID' });

  const listResult = await updateListById(listId, title);

  return res.status(listResult.status).json(listResult);
};

export const deleteListTaskById = async (req, res) => {
  const { id: listId } = req.params;
  const user = req.user;

  if (!listId || !user)
    return res.status(500).json({ message: 'không tìm thấy user hoặc title' });

  const delResult = await deleteListById(listId, user._id);

  return res.status(delResult.status).json(delResult);
};

// == share List Task ==
