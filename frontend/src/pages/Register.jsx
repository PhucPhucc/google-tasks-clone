import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { registerAPI } from "../api/auth"; 

// 1. Import Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // 2. Thay alert bằng toast.warning cho validation
        if (!username || !email || !password) {
            toast.warning("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            const res = await registerAPI(email, password, username);

            if (res.data.success) {
                // 3. Thông báo thành công
                toast.success("Đăng ký thành công! Đang chuyển hướng...");
                
                // Thêm độ trễ 1.5s để người dùng kịp đọc thông báo trước khi chuyển trang
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }
        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            const errorMsg = err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
            
            // 4. Thông báo lỗi từ server
            toast.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center p-4">
            
            {/* 5. Thêm Container để hiển thị thông báo */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* --- SIGNUP CARD --- */}
            <div className="bg-white w-full max-w-[450px] rounded-2xl shadow-2xl z-10 py-20 sm:py-32 px-10 sm:px-14 relative flex flex-col justify-center">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-itim">
                    My Trello
                </h2>

                <form className="space-y-5" onSubmit={handleRegister}>
                    {/* 1. Username Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder=" "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="peer w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 text-base focus:outline-none focus:border-cyan-800 focus:border-2 focus:ring-0"
                        />
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-cyan-800 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-800">
                            Your Name
                        </label>
                    </div>

                    {/* 2. Email Input */}
                    <div className="relative">
                        <input
                            type="email"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 text-base focus:outline-none focus:border-cyan-800 focus:border-2 focus:ring-0"
                        />
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-cyan-800 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-800">
                            Email
                        </label>
                    </div>

                    {/* 3. Password Input */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 text-base focus:outline-none focus:border-cyan-800 focus:border-2 focus:ring-0"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-cyan-800 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-800">
                            Password
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="hover:cursor-pointer w-full bg-cyan-700 hover:bg-cyan-800 text-white text-base font-bold py-2.5 rounded-lg transition duration-200"
                    >
                        Sign up
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-400 font-medium">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button className="hover:cursor-pointer w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition text-gray-700 text-base font-bold">
                    <FcGoogle size={22} />
                    Continue with Google
                </button>

                <div className="text-center mt-6 text-sm text-gray-600 font-medium">
                    Already have an account?{" "}
                    <a href="/login" className="hover:cursor-pointer text-cyan-800 font-bold underline hover:text-cyan-900">
                        Login
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Register;