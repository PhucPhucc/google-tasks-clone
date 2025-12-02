import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
// Icons
import { FiPlus, FiMoreVertical, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { BiCalendarEvent } from "react-icons/bi";
// Hình ảnh minh họa (Dùng icon thay thế cho ảnh SVG)
import { MdOutlineVerified } from "react-icons/md";

const TaskColumn = ({ list, tasks, index, toggleTaskCompletion }) => {
  // State nhập liệu
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  // State đóng/mở phần Đã hoàn thành (Mặc định mở)
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);

  const activeTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  const handleAddTask = () => {
    if(!newTaskTitle.trim()) return setIsAdding(false);
    // Gọi prop onAddTask từ cha (Tạm thời alert)
    alert(`Thêm task: ${newTaskTitle}`); 
    setNewTaskTitle("");
    setNewTaskDesc("");
    setIsAdding(false);
  };

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
          {/* --- HEADER --- */}
          <div
            {...provided.dragHandleProps}
            className="p-4 flex items-center justify-between border-b border-gray-200 bg-white rounded-t-xl cursor-grab active:cursor-grabbing group flex-shrink-0"
          >
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-800 truncate">{list.name}</h3>
                {activeTasks.length > 0 && <span className="text-gray-400 text-xs font-normal">({activeTasks.length})</span>}
            </div>
            {/* <div className="p-1 hover:bg-gray-100 rounded cursor-pointer text-gray-500">
              <FiMoreVertical />
            </div> */}
          </div>

          {/* --- BODY --- */}
          <div className="overflow-y-auto p-3 custom-scrollbar">
            
            {/* Form Thêm */}
            {isAdding ? (
               <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 mb-3 animate-zoom-in">
                  <input 
                    autoFocus
                    placeholder="Tiêu đề"
                    className="w-full text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none mb-2"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                  <input 
                    placeholder="Chi tiết"
                    className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none mb-4"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                     <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 transition flex items-center gap-1">
                            <BiCalendarEvent size={14}/> Hôm nay
                        </button>
                     </div>
                     <button 
                        onClick={handleAddTask}
                        className="text-cyan-700 font-bold text-sm hover:bg-blue-50 px-3 py-1.5 rounded transition"
                     >
                        Xong
                     </button>
                  </div>
               </div>
            ) : (
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 text-cyan-700 text-sm font-bold cursor-pointer hover:bg-white p-2 rounded-lg w-full transition mb-2 shadow-sm border border-transparent hover:border-gray-100"
                >
                    <div className="bg-cyan-700 text-white rounded-full p-0.5"><FiPlus size={14} /></div> 
                    Thêm việc cần làm
                </button>
            )}

            {/* --- DANH SÁCH TASK (Droppable) --- */}
            {/* Kiểm tra: Nếu không có task nào và đã hoàn thành hết -> Hiện ảnh "Xuất sắc" */}
            {activeTasks.length === 0 && completedTasks.length > 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                    <MdOutlineVerified size={60} className="text-cyan-600 mb-4" /> {/* Icon thay thế ảnh */}
                    <h3 className="text-gray-800 font-bold text-base">Đã hoàn thành tất cả việc cần làm</h3>
                    <p className="text-gray-500 text-sm mt-1">Xuất sắc!</p>
                </div>
            ) : null}

            {/* Vùng thả Task */}
            <Droppable droppableId={list.id} type="task">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-3 min-h-[10px] transition-colors rounded-lg ${
                    snapshot.isDraggingOver ? "bg-blue-50/50 min-h-[50px]" : ""
                  }`}
                >
                  {activeTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 group hover:shadow-md transition-all relative ${
                            snapshot.isDragging ? "shadow-2xl ring-2 ring-cyan-700 rotate-2 z-50" : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            <div
                              onClick={() => toggleTaskCompletion(list.id, task.id)}
                              className="mt-0.5 w-5 h-5 flex-shrink-0 border-2 border-gray-400 rounded-full hover:border-cyan-700 cursor-pointer transition flex items-center justify-center"
                            ></div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-800 text-sm font-medium leading-tight mb-1">
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                               {task.deadline && (
                                  <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                      {task.deadline}
                                  </span>
                              )}
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

            {/* --- COMPLETED TASKS (COLLAPSIBLE) --- */}
            {completedTasks.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-2">
                {/* Header đóng mở */}
                <div 
                    onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition group select-none"
                >
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-700">
                        Đã hoàn thành ({completedTasks.length})
                    </span>
                    <div className="text-gray-400 group-hover:text-gray-600">
                        {isCompletedOpen ? <FiChevronDown size={16}/> : <FiChevronRight size={16}/>}
                    </div>
                </div>

                {/* Danh sách đã hoàn thành (Ẩn/Hiện) */}
                {isCompletedOpen && (
                    <div className="space-y-1 opacity-70 mt-1 animate-fadeIn">
                    {completedTasks.map((task) => (
                        <div
                        key={task.id}
                        className="group flex items-center gap-3 p-3 hover:bg-white hover:shadow-sm rounded-lg transition cursor-default"
                        >
                        <div
                            onClick={() => toggleTaskCompletion(list.id, task.id)}
                            className="w-5 h-5 flex-shrink-0 bg-cyan-700 border-2 border-cyan-700 rounded-full cursor-pointer flex items-center justify-center text-white hover:opacity-80"
                        >
                            <FaCheck size={10} />
                        </div>
                        <span className="text-sm text-gray-500 line-through decoration-gray-400">
                            {task.title}
                        </span>
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