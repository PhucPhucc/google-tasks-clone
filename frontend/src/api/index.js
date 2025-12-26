import axiosClient from './axiosClient';

export const authApi = {
  login: (data) => axiosClient.post('/auth/login', data), //
  register: (data) => axiosClient.post('/auth/register', data), //
};

export const listApi = {
  getAll: () => axiosClient.get('/list'), // Lấy danh sách List
  create: (title) => axiosClient.post('/list', { title }), //
  delete: (id) => axiosClient.delete(`/list/${id}`), //
};

export const taskApi = {
  // Lưu ý: API này trả về tasks gộp theo list (nếu bạn đã sửa BE) hoặc tất cả task
  getAll: () => axiosClient.get('/tasks'), //
  create: (data) => axiosClient.post('/tasks', data), //
  updateStatus: (id, isCompleted) => axiosClient.patch(`/tasks/${id}/status`, { isCompleted }), //
};