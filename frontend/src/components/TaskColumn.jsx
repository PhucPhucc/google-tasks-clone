import React, { useState, useRef, useEffect } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { FiPlus, FiMoreHorizontal, FiChevronDown, FiChevronRight, FiTrash2, FiEdit2, FiCheckSquare, FiPrinter } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";

// Nhận prop onOpenCreateModal từ Home
const TaskColumn = ({ list, tasks, index, toggleTaskCompletion, onRenameList, onDeleteList, onDeleteCompleted, onOpenCreateModal }) => {
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const activeTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`w-[350px] flex-shrink-0 flex flex-col h-fit max-h-full bg-[#f8f9fa] rounded-xl border border-gray-200 shadow-sm transition-shadow ${
            snapshot.isDragging ? "shadow-2xl ring-2 ring-cyan-700 opacity-90 rotate-1" : ""
          }`}
        >
          {/* HEADER */}
          <div
            {...provided.dragHandleProps}
            className="p-4 flex items-center justify-between border-b border-gray-200 bg-white rounded-t-xl cursor-grab active:cursor-grabbing group flex-shrink-0 relative"
          >
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-800 truncate max-w-[200px]">{list.name}</h3>
                {activeTasks.length > 0 && <span className="text-gray-400 text-xs font-normal">({activeTasks.length})</span>}
            </div>

            {/* Menu Button */}
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition cursor-pointer"
                >
                    <FiMoreHorizontal size={20}/>
                </button>

                {showMenu && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#303134] text-[#e8eaed] rounded-lg shadow-2xl z-50 py-2 animate-fadeIn origin-top-right text-sm">
                        {/* <div className="px-4 py-2 border-b border-gray-600 mb-1">
                            <span className="text-xs text-gray-400 font-medium">Sắp xếp theo</span>
                            <div className="flex items-center gap-2 mt-2 cursor-pointer hover:text-white">
                                <FiCheckSquare/> Trình tự của tôi
                            </div>
                        </div>
                        <button onClick={() => {onRenameList(list); setShowMenu(false)}} className="w-full text-left px-4 py-2.5 hover:bg-[#3c4043] transition flex items-center gap-3">
                            <FiEdit2/> Đổi tên danh sách
                        </button> */}
                        
                        {/* --- SỬA LOGIC Ở ĐÂY: Dùng list.isDefault thay vì list.is_default --- */}
                        {!list.isDefault && list.name !== "Việc cần làm của tôi" ? (
                             <button onClick={() => {onDeleteList(list.id); setShowMenu(false)}} className="w-full text-left px-4 py-2.5 hover:bg-[#3c4043] transition flex items-center gap-3">
                                <FiTrash2/> Xóa danh sách
                            </button>
                        ) : (
                            <div className="px-4 py-2.5 text-gray-500 cursor-not-allowed flex items-center gap-3 select-none">
                                <FiTrash2/> Không thể xóa danh sách mặc định
                            </div>
                        )}

                        <div className="border-t border-gray-600 my-1"></div>
                        {/* <button className="w-full text-left px-4 py-2.5 hover:bg-[#3c4043] transition flex items-center gap-3">
                            <FiPrinter/> In danh sách
                        </button> */}
                        <button onClick={() => {onDeleteCompleted(list.id); setShowMenu(false)}} className="w-full text-left px-4 py-2.5 hover:bg-[#3c4043] transition flex items-center gap-3">
                            <FiTrash2/> Xóa tất cả việc đã hoàn thành
                        </button>
                    </div>
                )}
            </div>
          </div>

          {/* BODY */}
          <div className="overflow-y-auto p-3 custom-scrollbar flex-1 min-h-[100px]">
            {/* Nút Thêm Việc Cần Làm */}
            <button 
                onClick={() => onOpenCreateModal(list.name)} 
                className="flex items-center gap-2 text-cyan-700 text-sm font-bold cursor-pointer hover:bg-white p-2 rounded-lg w-full transition mb-2 shadow-sm border border-transparent hover:border-gray-100"
            >
                <div className="bg-cyan-700 text-white rounded-full p-0.5"><FiPlus size={14} /></div> Thêm việc cần làm
            </button>

            {/* Empty State */}
            {activeTasks.length === 0 && completedTasks.length > 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <MdOutlineVerified size={50} className="text-cyan-600 mb-2" />
                    <p className="text-gray-500 text-xs">Đã hoàn thành tất cả!</p>
                </div>
            )}

            <Droppable droppableId={list.id} type="task">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className={`space-y-2 min-h-[20px] ${snapshot.isDraggingOver ? "bg-blue-50/50" : ""}`}>
                  {activeTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 group hover:shadow transition relative ${snapshot.isDragging ? "shadow-xl ring-2 ring-cyan-700 rotate-2 z-50" : ""}`}>
                          <div className="flex gap-3 items-start">
                            <div onClick={() => toggleTaskCompletion(list.id, task.id)} className="mt-0.5 w-4 h-4 flex-shrink-0 border-2 border-gray-400 rounded-full hover:border-cyan-700 cursor-pointer transition"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-800 text-sm font-medium leading-tight">{task.title}</p>
                              {task.description && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{task.description}</p>}
                              {task.deadline && <span className="inline-block mt-1 text-[10px] bg-red-50 text-red-600 px-1.5 rounded border border-red-100">{task.deadline}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-2">
                <div onClick={() => setIsCompletedOpen(!isCompletedOpen)} className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded transition">
                    <span className="text-xs font-bold text-gray-500 uppercase">Đã hoàn thành ({completedTasks.length})</span>
                    {isCompletedOpen ? <FiChevronDown className="text-gray-400"/> : <FiChevronRight className="text-gray-400"/>}
                </div>
                {isCompletedOpen && (
                    <div className="space-y-1 mt-1 opacity-70">
                    {completedTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-2 bg-white/50 rounded hover:bg-white transition">
                             <div onClick={() => toggleTaskCompletion(list.id, task.id)} className="w-4 h-4 flex-shrink-0 bg-cyan-700 text-white rounded-full flex items-center justify-center cursor-pointer"><FaCheck size={10}/></div>
                             <span className="text-sm text-gray-500 line-through decoration-gray-400">{task.title}</span>
                        </div>
                    ))}
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default TaskColumn;