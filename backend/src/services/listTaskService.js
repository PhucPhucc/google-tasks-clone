import mongoose from 'mongoose';
import TaskList from '../models/TaskList.js';
import { responseFailer } from '../utils/appUtils.js';

export const getListByUserId = async (userId) => {
  try {
    const list = await TaskList.find({ ownerId: userId });
    if (!list)
      return { success: false, status: 400, message: 'không tìm thấy user ID' };

    return { success: true, status: 200, list };
  } catch (error) {
    return responseFailer('getListByUserId', error);
  }
};

export const createList = async (userId, title) => {
  try {
    await TaskList.create({
      title,
      ownerId: userId,
      member: [],
    });

    return {
      success: true,
      status: 201,
      message: 'Đã thêm danh sách mới thành công',
    };
  } catch (error) {
    return responseFailer('createList', error);
  }
};

export const getListById = async (taskId) => {
  try {
    const list = await TaskList.findById(taskId);
    if (!list)
      return { success: false, status: 400, message: 'không tìm thấy list ID' };

    return { success: true, status: 200, list };
  } catch (error) {
    return responseFailer('getListByUserId', error);
  }
};

export const updateListById = async (taskId, title) => {
  try {
    const list = await TaskList.findByIdAndUpdate(taskId, { title });
    if (!list)
      return { success: false, status: 400, message: 'không tìm thấy task ID' };

    return { success: true, status: 200, list };
  } catch (error) {
    return responseFailer('getListById', error);
  }
};

export const deleteListById = async (taskId, userId) => {
  try {
    const list = await TaskList.findById(taskId);

    if (!list)
      return { success: false, status: 400, message: 'không tìm thấy task ID' };
    console.log(list.ownerId);
    console.log(userId);
    if (!list.ownerId.equals(userId))
      return { success: false, status: 400, message: 'Bạn không phải chủ sở hữu' };

    await TaskList.findByIdAndDelete(taskId);


    return { success: true, status: 200, message: `xoá ${taskId} thành công`};
  } catch (error) {
    return responseFailer('deleteListById', error);
  }
};
