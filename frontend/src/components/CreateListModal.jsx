import React, { useState } from "react";

const CreateListModal = ({ isOpen, onClose, onCreate }) => {
  const [listName, setListName] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!listName.trim()) return; 
    onCreate(listName);
    setListName(""); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl p-6 animate-zoom-in flex flex-col gap-6">
        
        {/* Tiêu đề */}
        <h3 className="text-xl font-medium text-gray-800">Tạo danh sách mới</h3>
        
        {/* Ô nhập tên danh sách */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Nhập tên" 
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="w-full text-base py-2 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300"></div>
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-focus-within:w-full"></div>
        </div>

        {/* Nút hành động (Huỷ / Xong) */}
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={() => {
                setListName("");
                onClose();
            }}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-full transition"
          >
            Huỷ
          </button>
          <button 
            onClick={handleCreate}
            disabled={!listName.trim()} 
            className={`px-6 py-2 text-sm font-bold rounded-full transition 
              ${listName.trim() 
                ? "text-blue-700 hover:bg-blue-50 cursor-pointer" 
                : "text-gray-300 cursor-not-allowed"}`
            }
          >
            Xong
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateListModal;