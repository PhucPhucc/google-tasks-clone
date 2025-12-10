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
  const list = req.taskList;
  const tasksResult = await getTasks(list._id);

  return res.status(tasksResult.status).json(tasksResult);
};

export const updateListTaskById = async (req, res) => {
  const list = req.taskList;
  const { title } = req.body;

  const listResult = await updateListById(list._id, title);

  return res.status(listResult.status).json(listResult);
};

export const deleteListTaskById = async (req, res) => {
  const list = req.taskList;
  const user = req.user;

  const delResult = await deleteListById(list._id, user._id);

  return res.status(delResult.status).json(delResult);
};

// == share List Task ==
