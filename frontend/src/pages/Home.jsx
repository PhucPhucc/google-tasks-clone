import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

// Components
import Header from "../components/Header";
import CreateTaskModal from "../components/CreateTaskModal";
import CreateListModal from "../components/CreateListModal";
import TaskColumn from "../components/TaskColumn";

// Icons
import { FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdLabelOutline } from "react-icons/md";
import { BiSquare, BiCheckSquare } from "react-icons/bi";

// DATA MẪU
const initialData = {
  lists: {
    "list-1": {
      id: "list-1",
      name: "Việc cần làm của tôi",
      isVisible: true,
      tasks: [
        { id: "task-1", title: "Mua cà phê", description: "Mua loại Arabica", isCompleted: false, deadline: "14:00" },
        { id: "task-2", title: "Họp team", description: "", isCompleted: true, deadline: "15:30" },
      ],
    },
    "list-2": {
      id: "list-2",
      name: "Study",
      isVisible: true,
      tasks: [
        { id: "task-3", title: "Làm bài tập React", description: "Học hook useMemo", isCompleted: false, deadline: "CN" },
      ],
    },
    "list-3": {
      id: "list-3",
      name: "Food",
      isVisible: false,
      tasks: [],
    },
  },
  listOrder: ["list-1", "list-2", "list-3"],
};

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(initialData);

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarListExpanded, setIsSidebarListExpanded] = useState(true);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else {
      setUser({
        username: "Hoàng Phúc Lâm",
        email: "phuclh.ce191132@gmail.com",
        avatar: "" 
      });
    }
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleListVisibility = (listId) => {
    const newList = { ...data.lists[listId], isVisible: !data.lists[listId].isVisible };
    setData({ ...data, lists: { ...data.lists, [listId]: newList } });
  };

  const toggleTaskCompletion = (listId, taskId) => {
    const list = data.lists[listId];
    const newTasks = list.tasks.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setData({ ...data, lists: { ...data.lists, [listId]: { ...list, tasks: newTasks } } });
  };

  // Logic Kéo Thả
  const handleOnDragEnd = (result) => {
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

    setData({
      ...data,
      lists: {
        ...data.lists,
        [startList.id]: { ...startList, tasks: startTasks },
        [finishList.id]: { ...finishList, tasks: finishTasks },
      },
    });
  };

  const handleCreateList = (listName) => {
    const newId = `list-${Date.now()}`;
    const newList = { id: newId, name: listName, isVisible: true, tasks: [] };
    setData({ lists: { ...data.lists, [newId]: newList }, listOrder: [...data.listOrder, newId] });
  };

  const handleCreateTask = (newTaskData) => {
    // Logic giả lập thêm task
    alert("Đã nhận dữ liệu task: " + newTaskData.title);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen relative bg-transparent">

      <CreateTaskModal isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} onSave={handleCreateTask} />
      <CreateListModal isOpen={isCreateListOpen} onClose={() => setIsCreateListOpen(false)} onCreate={handleCreateList} />

      <Header toggleSidebar={toggleSidebar} user={user} />

      <div className=" flex flex-1 overflow-hidden relative">

        {/* --- SIDEBAR --- */}
        <aside
          className={`bg-white/50 backdrop-blur-md h-full flex-shrink-0 border-r border-gray-200/50 transition-all duration-300 ease-in-out overflow-y-auto ${isSidebarOpen ? "w-72" : "w-0 overflow-hidden"}`}
        >
          <div className="p-4 pb-2">
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className=" flex items-center gap-3 bg-white py-3 px-5 rounded-full shadow hover:shadow-md transition text-gray-700 font-bold border border-gray-100 cursor-pointer w-full justify-center"
            >
              <FiPlus size={24} className="text-cyan-700" />
              <span>Tạo công việc</span>
            </button>
          </div>

          <div className="mt-4">
            <div
              className="flex items-center justify-between px-6 py-2 text-gray-700 hover:bg-white/40 cursor-pointer font-bold text-sm transition"
              onClick={() => setIsSidebarListExpanded(!isSidebarListExpanded)}
            >
              <span>Danh sách</span>
              {isSidebarListExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {isSidebarListExpanded && (
              <div className="mt-1  animate-fadeIn">
                {data.listOrder.map((listId) => {
                  const list = data.lists[listId];
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
                <div onClick={() => setIsCreateListOpen(true)} className="flex items-center gap-4 px-6 py-3 text-gray-600 hover:text-gray-700 cursor-pointer transition mt-2 pl-[3.2rem]">
                  <FiPlus size={18} />
                  <span className="font-bold text-sm">Tạo danh sách mới</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* --- MAIN BOARD --- */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden bg-transparent p-6">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  className="flex gap-6 h-full items-start"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {data.listOrder.map((listId, index) => {
                    const list = data.lists[listId];
                    if (!list.isVisible) return null;

                    return (
                      <TaskColumn
                        key={list.id}
                        list={list}
                        tasks={list.tasks}
                        index={index}
                        toggleTaskCompletion={toggleTaskCompletion}
                      />
                    );
                  })}

                  {provided.placeholder}

                  {data.listOrder.every(id => !data.lists[id].isVisible) && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <MdLabelOutline size={120} className="text-white/50 mb-6" /> 
                      <h3 className="text-xl font-bold text-gray-600 mb-2 ">Tất cả danh sách đều bị ẩn</h3>
                      <p className="text-gray-500 text-sm">Hãy chọn một danh sách bất kỳ để xem việc cần làm của bạn</p>
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