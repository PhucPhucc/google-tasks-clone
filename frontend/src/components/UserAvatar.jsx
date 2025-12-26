import React from "react";

const UserAvatar = () => {
  // Lấy thông tin từ localStorage (hoặc bạn có thể truyền qua props)
  const name = localStorage.getItem("user_display_name") || "Hoàng Phúc Lâm";
  const email = localStorage.getItem("user_email") || "phuclh.ce191132@gmail.com";
  
  // Link ảnh avatar mẫu (bạn thay bằng link thật của user)
  const avatarUrl = "https://ui-avatars.com/api/?name=" + name + "&background=random";

  return (
    // 1. Container: dùng 'relative' để định vị menu con, 'group' để bắt sự kiện hover
    <div className="relative group inline-block cursor-pointer">
      
      {/* 2. Hình ảnh Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-cyan-700 transition-all">
        <img 
          src={avatarUrl} 
          alt="User Avatar" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* 3. Phần Tooltip/Popup thông tin (Giống hình bạn gửi) */}
      {/* Mặc định ẩn (invisible opacity-0), khi group-hover thì hiện (visible opacity-100) */}
      <div className="absolute right-0 top-full mt-2 w-64 bg-[#2D333B] text-white rounded-lg shadow-xl border border-gray-700 p-4 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 transform origin-top-right">
        
        {/* Header nhỏ */}
        <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
          Tài khoản My Trello
        </div>

        {/* Tên người dùng */}
        <div className="text-base font-bold text-gray-100 truncate">
          {name}
        </div>

        {/* Email */}
        <div className="text-sm text-gray-400 truncate">
          {email}
        </div>

      </div>
    </div>
  );
};

export default UserAvatar;