import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify"; // 1. Import Toastify

// Icons
import {
    FiUser, FiMail, FiLock, FiSave, FiArrowLeft,
    FiCheckCircle, FiShield, FiCamera, FiEdit3
} from "react-icons/fi";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // State quản lý Tab (info | security)
    const [activeTab, setActiveTab] = useState("info");

    // State form đổi mật khẩu
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    // Đã xóa state 'message' vì dùng Toast thay thế
    const [isSaving, setIsSaving] = useState(false);

    // 1. Lấy thông tin User
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosClient.get("/profile");
                if (res.data && res.data.user) {
                    setUser(res.data.user);
                }
            } catch (error) {
                if (error.response?.status === 401) navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    // 2. Xử lý đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwords.newPassword.length <= 6) {
            toast.warn("Mật khẩu phải dài hơn 6 ký tự!"); // Dùng Toast Warn
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!"); // Dùng Toast Error
            return;
        }

        try {
            setIsSaving(true);
            await axiosClient.patch("/profile", { newPassword: passwords.newPassword });

            toast.success("Đổi mật khẩu thành công!"); // Dùng Toast Success
            setPasswords({ newPassword: "", confirmPassword: "" });

        } catch (error) {
            toast.error(error.response?.data || "Lỗi server!"); // Dùng Toast Error
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-500 font-medium">Đang tải...</div>;
    if (!user) return null;

    return (
        <div className="flex flex-col h-screen bg-[#f0f2f5]">

            {/* Header */}
            <Header toggleSidebar={() => { }} user={user} isProfilePage={true} />

            {/* <div className="">
        <div className=""> */}

            {/* --- NÚT QUAY LẠI --- */}
            {/* <button 
                onClick={() => navigate("/")}
                className="group flex items-center gap-3 text-gray-500 hover:text-cyan-700 font-bold mb-6 transition-all transform hover:-translate-x-1"
            >
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-cyan-200 transition">
                    <FiArrowLeft size={20} />
                </div>
                <span className="text-lg">Quay lại bảng công việc</span>
            </button> */}

            {/* --- CARD PROFILE LỚN --- */}
            <div className="bg-white   overflow-hidden border border-gray-100 animate-zoom-in">

                {/* 1. COVER PHOTO */}
                <div className="h-48 bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-500 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    

                </div>

                {/* 2. HEADER INFO (Avatar đè lên Cover) */}
                <div className="px-8 pb-8 relative flex flex-col md:flex-row items-end -mt-16 gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center text-5xl font-bold text-cyan-700 uppercase">
                            {user.username?.charAt(0)}
                        </div>

                    </div>

                    {/* Tên & Tab */}
                    <div className="flex-1 w-full ">
                        <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl self-center md:self-end mb-2 w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${activeTab === "info" ? "bg-white text-cyan-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:cursor-pointer"}`}
                        >
                            <FiUser /> Thông tin
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${activeTab === "security" ? "bg-white text-cyan-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:cursor-pointer"}`}
                        >
                            <FiShield /> Bảo mật
                        </button>
                    </div>
                </div>

                {/* 3. CONTENT BODY */}
                <div className="px-8 py-8">

                    {/* --- TAB INFO --- */}
                    {activeTab === "info" && (
                        <div className=" mx-auto animate-fadeIn">

                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">Chi tiết tài khoản</h3>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Tên hiển thị</label>
                                    <div className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FiUser size={20} /></div>
                                        <span className="font-medium text-gray-700 text-lg">{user.username}</span>
                                        {/* <button className="ml-auto text-gray-400 hover:text-cyan-700"><FiEdit3/></button> */}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Email liên kết</label>
                                    <div className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FiMail size={20} /></div>
                                        <span className="font-medium text-gray-700 text-lg">{user.email}</span>
                                        <span className="ml-auto flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                            <FiCheckCircle /> Verified
                                        </span>
                                    </div>
                                </div>
                            </div>


                        </div>
                    )}

                    {/* --- TAB SECURITY --- */}
                    {activeTab === "security" && (
                        <div className="max-w-2xl mx-auto animate-fadeIn">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiLock size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Đổi mật khẩu</h3>
                                <p className="text-gray-500">Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn</p>
                            </div>

                            <form onSubmit={handleChangePassword} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                                {/* Đã xóa Alert Box thủ công ở đây */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-50 transition"
                                            placeholder="••••••••"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Xác nhận lại</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-50 transition"
                                            placeholder="••••••••"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className={`w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg hover:shadow-cyan-700/30 transform active:scale-[0.99] flex items-center justify-center gap-2
                                            ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                                    >
                                        {isSaving ? "Đang xử lý..." : "Lưu mật khẩu mới"}
                                        {!isSaving && <FiSave size={18} />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
        //   </div>
        // </div>
    );
};

export default Profile;