import axios from 'axios';

// Đảm bảo URL này đúng với port backend của bạn (mặc định là 5000)
const API_URL = 'http://127.0.0.1:5000/api/auth';

export const loginAPI = (username, password) => {
    return axios.post(`${API_URL}/login`, { username, password });
};

// --- THÊM HÀM NÀY ---
export const registerAPI = (email, password, username) => {
    return axios.post(`${API_URL}/register`, { email, password, username });
};