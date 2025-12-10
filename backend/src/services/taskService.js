import Task from '../models/Task.js';
import TaskList from '../models/TaskList.js';
import { responseFailer } from '../utils/appUtils.js';

export const getAllTaskService = async (userId) => {
  try {
    const lists = await TaskList.find({ ownerId: userId });
    console.log(lists);
    lists.forEach(async (list) => {
      list.tasks = await Task.find({ taskListId: list._id });
      console.log(list);
    });
    // console.log(lists);

    return {
      success: true,
      status: 200,
      message: 'Lấy danh sách task thành công',
      // tasksResult
    };
  } catch (error) {
    return responseFailer('getAllTaskService', error);
  }
};

export const createNewTaskService = async (userId, taskData) => {
  const {
    title,
    description,
    taskListId,
    dueDateTime,
    isAllDay,
    isImportant,
    isRecurring,
    recurrence,
  } = taskData;

  const taskList = await TaskList.findOne({
    _id: taskListId,
    ownerId: userId,
  });

  if (!taskList) {
    throw new Error('TASK_LIST_NOT_FOUND');
  }

  let finalDueDate = dueDateTime;
  if (isAllDay && dueDateTime) {
    const date = new Date(dueDateTime);
    date.setUTCHours(0, 0, 0, 0);
    finalDueDate = date.toISOString();
  }

  const newTask = await Task.create({
    userId,
    taskListId,
    title: title || '',
    description: description || '',
    isCompleted: false,
    isImportant: isImportant || false,
    dueDateTime: finalDueDate,
    isAllDay: isAllDay || false,
    isRecurring: isRecurring || false,
    recurrence: isRecurring ? recurrence : null,
  });
  return newTask;
};
