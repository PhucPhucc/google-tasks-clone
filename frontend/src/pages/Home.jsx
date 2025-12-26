import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Header from "../components/Header";
import CreateTaskModal from "../components/CreateTaskModal";
import CreateListModal from "../components/CreateListModal";
import TaskColumn from "../components/TaskColumn";
import { FiPlus, FiChevronDown, FiChevronUp, FiAlertTriangle } from "react-icons/fi";
import { MdLabelOutline } from "react-icons/md";
import { BiSquare, BiCheckSquare } from "react-icons/bi";
import { listApi, taskApi } from "../api";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify"; // 1. Import Toast

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ lists: {}, listOrder: [] });
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarListExpanded, setIsSidebarListExpanded] = useState(true);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [currentListForModal, setCurrentListForModal] = useState("");

  // --- STATE CHO MODAL XÁC NHẬN XÓA (Mới) ---
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'deleteList' | 'clearCompleted'
    id: null,
    title: "",
    message: ""
  });

  const fetchUserProfile = async () => {
    try {
      const res = await axiosClient.get('/profile'); 
      if (res.data && res.data.user) setUser(res.data.user); 
    } catch (error) {
      console.error("Lỗi profile:", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const resList = await listApi.getAll();
      const rawLists = resList.data; 
      const newLists = {};
      const newListOrder = [];
      
      for (const list of rawLists) {
        const resTasks = await axiosClient.get(`/list/${list._id}/tasks`);
        const tasks = resTasks.data.tasks || [];
        newLists[list._id] = {
          id: list._id,
          name: list.title,
          isVisible: true,
          isDefault: list.is_default, 
          tasks: tasks.map(t => ({
            id: t._id,
            title: t.title,
            description: t.description,
            isCompleted: t.isCompleted,
            deadline: t.dueDateTime ? new Date(t.dueDateTime).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}) : null,
          }))
        };
        newListOrder.push(list._id);
      }
      setData({ lists: newLists, listOrder: newListOrder });
    } catch (error) {
      // toast.error("Không thể tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else {
      fetchUserProfile();
      fetchData();
    }
  }, [navigate]);

  const handleCreateList = async (listName) => {
    try {
        await listApi.create(listName);
        toast.success("Tạo danh sách thành công!"); // Toast
        fetchData();
    } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi tạo danh sách");
    }
  };

  const handleOpenCreateTaskModal = (listName = "") => {
      setCurrentListForModal(listName);
      setIsCreateTaskOpen(true);
  }

  const handleCreateTaskModal = async (newTaskData) => {
    try {
        const targetListObj = Object.values(data.lists).find(list => list.name === newTaskData.selectedList);
        let targetListId = targetListObj ? targetListObj.id : (data.listOrder.length > 0 ? data.listOrder[0] : null);

        if (!targetListId) return toast.warn("Vui lòng tạo danh sách trước!");

        const payload = {
            title: newTaskData.title,
            description: newTaskData.description,
            taskListId: targetListId,
            dueDateTime: newTaskData.dateInput ? new Date().toISOString() : null,
            isAllDay: false, 
            isImportant: false
        };
        await taskApi.create(payload);
        toast.success("Đã thêm công việc mới"); // Toast
        fetchData();
    } catch (error) {
        toast.error("Lỗi tạo công việc");
    }
  };

  // --- XỬ LÝ MỞ MODAL XÓA ---
  const openDeleteListModal = (id) => {
      setConfirmModal({
          isOpen: true,
          type: 'deleteList',
          id: id,
          title: "Xóa danh sách này?",
          message: "Hành động này không thể hoàn tác. Tất cả công việc trong danh sách sẽ bị xóa vĩnh viễn."
      });
  }

  const openClearCompletedModal = (id) => {
      setConfirmModal({
          isOpen: true,
          type: 'clearCompleted',
          id: id,
          title: "Xóa công việc đã xong?",
          message: "Bạn có chắc muốn xóa tất cả các công việc đã hoàn thành trong danh sách này?"
      });
  }

  // --- XỬ LÝ HÀNH ĐỘNG XÁC NHẬN ---
  const handleConfirmAction = async () => {
      try {
          if (confirmModal.type === 'deleteList') {
              await listApi.delete(confirmModal.id);
              toast.success("Đã xóa danh sách");
          } else if (confirmModal.type === 'clearCompleted') {
              await axiosClient.delete('/tasks/clear-completed', { data: { taskListId: confirmModal.id } });
              toast.success("Đã dọn dẹp công việc hoàn thành");
          }
          fetchData();
      } catch (error) {
          toast.error("Đã xảy ra lỗi: " + (error.response?.data?.message || error.message));
      } finally {
          setConfirmModal({ ...confirmModal, isOpen: false });
      }
  }

  // ... (Các hàm toggleSidebar, toggleListVisibility, toggleTaskCompletion, handleOnDragEnd GIỮ NGUYÊN) ...
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleListVisibility = (listId) => {
    const newList = { ...data.lists[listId], isVisible: !data.lists[listId].isVisible };
    setData({ ...data, lists: { ...data.lists, [listId]: newList } });
  };
  const toggleTaskCompletion = async (listId, taskId) => {
    const list = data.lists[listId];
    const task = list.tasks.find(t => t.id === taskId);
    const newStatus = !task.isCompleted;
    const newTasks = list.tasks.map(t => t.id === taskId ? { ...t, isCompleted: newStatus } : t);
    setData({ ...data, lists: { ...data.lists, [listId]: { ...list, tasks: newTasks } } });
    try { await taskApi.updateStatus(taskId, newStatus); } catch (error) { fetchData(); }
  };
  const handleOnDragEnd = async (result) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "column") {
      const newOrder = Array.from(data.listOrder);
      const [removed] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, removed);
      setData({ ...data, listOrder: newOrder });
      return;
    }
    const startList = data.lists[source.droppableId];
    const finishList = data.lists[destination.droppableId];
    if (startList === finishList) {
      const newTasks = Array.from(startList.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      setData({ ...data, lists: { ...data.lists, [startList.id]: { ...startList, tasks: newTasks } } });
      return;
    }
    const startTasks = Array.from(startList.tasks);
    const [movedTask] = startTasks.splice(source.index, 1);
    const finishTasks = Array.from(finishList.tasks);
    finishTasks.splice(destination.index, 0, movedTask);
    setData({ ...data, lists: { ...data.lists, [startList.id]: { ...startList, tasks: startTasks }, [finishList.id]: { ...finishList, tasks: finishTasks } } });
    try {
        if (!movedTask?.id || !finishList?.id) throw new Error("ID Error");
        await axiosClient.patch(`/tasks/${movedTask.id}/move`, { targetTaskListId: finishList.id });
    } catch (error) {
        console.error("Move Error", error);
        toast.error("Lỗi di chuyển: " + (error.response?.data?.message || "Server Error")); // Toast
        fetchData();
    }
  };


  const displayUser = user || { username: "Khách", email: "" };
  if (!user && isLoading) return <div className="flex h-screen items-center justify-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col h-screen relative bg-transparent">
      {/* --- CONFIRMATION MODAL --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-zoom-in">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                        <FiAlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{confirmModal.title}</h3>
                        <p className="text-sm text-gray-500 mt-2">{confirmModal.message}</p>
                    </div>
                    <div className="flex gap-3 w-full mt-2">
                        <button 
                            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            onClick={handleConfirmAction}
                            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg hover:shadow-red-500/30 transition"
                        >
                            Xóa ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <CreateTaskModal 
        isOpen={isCreateTaskOpen} 
        onClose={() => setIsCreateTaskOpen(false)} 
        onSave={handleCreateTaskModal} 
        listOptions={data.listOrder.map(id => data.lists[id].name)}
        defaultList={currentListForModal} 
      />
      <CreateListModal 
        isOpen={isCreateListOpen} 
        onClose={() => setIsCreateListOpen(false)} 
        onCreate={handleCreateList} 
      />
      <Header toggleSidebar={toggleSidebar} user={displayUser} />

      <div className=" flex flex-1 overflow-hidden relative">
        <aside className={`bg-white/50 backdrop-blur-md h-full flex-shrink-0 border-r border-gray-200/50 transition-all duration-300 ease-in-out overflow-y-auto ${isSidebarOpen ? "w-72" : "w-0 overflow-hidden"}`}>
          <div className="p-4 pb-2">
            <button onClick={() => handleOpenCreateTaskModal()} className=" flex items-center gap-3 bg-white py-3 px-5 rounded-full shadow hover:shadow-md transition text-gray-700 font-bold border border-gray-100 cursor-pointer w-full justify-center">
              <FiPlus size={24} className="text-cyan-700" /> <span>Tạo công việc</span>
            </button>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between px-6 py-2 text-gray-700 hover:bg-white/40 cursor-pointer font-bold text-sm transition" onClick={() => setIsSidebarListExpanded(!isSidebarListExpanded)}>
              <span>Danh sách</span> {isSidebarListExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {isSidebarListExpanded && (
              <div className="mt-1 animate-fadeIn pb-4">
                {data.listOrder.map((listId) => {
                  const list = data.lists[listId];
                  if (!list) return null;
                  return (
                    <div key={listId} className="flex items-center justify-between px-6 py-2.5 hover:bg-white/40 cursor-pointer transition group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div onClick={(e) => { e.stopPropagation(); toggleListVisibility(listId); }} className="text-gray-500 hover:text-cyan-700">
                          {list.isVisible ? <BiCheckSquare size={22} className="text-cyan-700" /> : <BiSquare size={22} />}
                        </div>
                        <span className={`text-sm truncate ${list.isVisible ? "text-gray-800 font-medium" : "text-gray-500"}`}>{list.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-gray-600">{list.tasks.filter(t => !t.isCompleted).length}</span>
                    </div>
                  );
                })}
                <div onClick={() => setIsCreateListOpen(true)} className="flex items-center gap-4 px-6 py-3 text-gray-600 hover:text-gray-700 cursor-pointer transition mt-2 pl-[3.2rem] hover:bg-white/40">
                  <FiPlus size={18} /> <span className="font-bold text-sm">Tạo danh sách mới</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-x-auto overflow-y-hidden bg-transparent p-6">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div className="flex gap-6 h-full items-start" {...provided.droppableProps} ref={provided.innerRef}>
                  {data.listOrder.map((listId, index) => {
                    const list = data.lists[listId];
                    if (!list || !list.isVisible) return null;
                    return (
                      <TaskColumn
                        key={list.id}
                        list={list}
                        tasks={list.tasks}
                        index={index}
                        toggleTaskCompletion={toggleTaskCompletion}
                        onOpenCreateModal={handleOpenCreateTaskModal}
                        // --- THAY ALERT BẰNG MODAL ---
                        onDeleteList={() => openDeleteListModal(list.id)}
                        onDeleteCompleted={() => openClearCompletedModal(list.id)}
                        onRenameList={(list) => toast.info(`Tính năng đổi tên "${list.name}" đang phát triển`)}
                      />
                    );
                  })}
                  {provided.placeholder}
                  {/* Empty States giữ nguyên */}
                  {data.listOrder.length === 0 && !isLoading && (
                     <div className="w-full h-full flex flex-col items-center justify-center">
                        <MdLabelOutline size={80} className="text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2 ">Bạn chưa có danh sách nào</h3>
                        <button onClick={() => setIsCreateListOpen(true)} className="text-white bg-cyan-700 hover:bg-cyan-800 px-4 py-2 rounded-lg font-bold shadow transition">+ Tạo danh sách ngay</button>
                     </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </main>
      </div>
    </div>
  );
};
export default Home;