import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginAPI } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
// 1. Import thêm ToastContainer và CSS để thông báo hoạt động
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validate input
        if (!username || !password) {
            return toast.warning("Vui lòng nhập Username và Password");
        }

        try {
            const res = await loginAPI(username, password); 
            const { accessToken, message } = res.data;

            localStorage.setItem("token", accessToken); 
            localStorage.setItem("user_display_name", username);
            
            toast.success(message || "Đăng nhập thành công!");
            
            // Chờ 1.5s để người dùng đọc thông báo rồi mới chuyển trang
            setTimeout(() => {
                navigate("/"); 
            }, 1500);
            
        } catch (err) {
            console.error("Lỗi Login:", err);
            
            // 2. HIỆN THÔNG BÁO LỖI (Bao gồm cả sai mật khẩu)
            // Lấy message từ Backend trả về (ví dụ: "Mật khẩu không đúng" hoặc "Tài khoản không tồn tại")
            const errorMsg = err.response?.data?.message || "Đăng nhập thất bại!";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center p-4">
            
            {/* 3. Cần có ToastContainer để thông báo hiện ra */}
            <ToastContainer position="top-right" autoClose={2000} />

            <div className="bg-white w-full max-w-[450px] rounded-2xl shadow-2xl z-10 py-24 sm:py-32 px-10 sm:px-14 relative flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-itim">My Trello</h2>
                
                <form className="space-y-5" onSubmit={handleLogin}>
                    {/* Username Input */}
                    <div className="relative">
                        <input
                            type="text" placeholder=" " value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="peer w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-cyan-700 focus:border-2 focus:ring-0"
                        />
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-cyan-700 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-700">
                            Username
                        </label>
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"} placeholder=" " value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className=" peer w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-cyan-700 focus:border-2 focus:ring-0"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-cyan-700 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-700 ">
                            Password
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-800 text-white text-base font-bold py-2.5 rounded-lg transition duration-200 hover:cursor-pointer">
                        Log in
                    </button>
                </form> 

                <div className="flex items-center my-3">
                    <div className="grow border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-400 font-medium">or</span>
                    <div className="grow border-t border-gray-300"></div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition text-gray-700 text-sm font-bold hover:cursor-pointer">
                    <FcGoogle size={20} /> Sign in with Google
                </button>

                <div className="text-center mt-3 text-sm text-gray-600 font-medium">
                    Need an account? <Link to="/register" className="text-cyan-800 font-bold underline hover:text-cyan-900 hover:cursor-pointer">Create one</Link>
                </div>
            </div>
        </div>
    );
};
export default Login;