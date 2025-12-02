import React, { useState, useEffect, useRef } from "react";
// Import Icons
import { RxCross2 } from "react-icons/rx";
import { MdOutlineWatchLater, MdOutlineDescription, MdOutlineFormatListBulleted } from "react-icons/md";
import { FiRepeat, FiChevronDown, FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    times.push(`${hour}:00`);
    times.push(`${hour}:30`);
  }
  return times;
};

const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const CreateTaskModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const [currMonth, setCurrMonth] = useState(today.getMonth());
  const [currYear, setCurrYear] = useState(today.getFullYear());
  const [selectedDateObj, setSelectedDateObj] = useState(null);

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeOptions = generateTimeOptions();

  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedList, setSelectedList] = useState("Việc cần làm của tôi");
  const [isRepeatOpen, setIsRepeatOpen] = useState(false);
  const [selectedRepeat, setSelectedRepeat] = useState("Không lặp lại");

  const listOptions = ["Việc cần làm của tôi", "Study", "Food"];
  const repeatOptions = ["Không lặp lại", "Hàng ngày", "Hàng tuần", "Hàng tháng", "Hàng năm"];

  const calendarRef = useRef(null);
  const timeRef = useRef(null);

  const handlePrevMonth = () => {
    if (currMonth === 0) {
      setCurrMonth(11);
      setCurrYear(currYear - 1);
    } else {
      setCurrMonth(currMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currMonth === 11) {
      setCurrMonth(0);
      setCurrYear(currYear + 1);
    } else {
      setCurrMonth(currMonth + 1);
    }
  };

  const handleSelectDate = (day) => {
    const date = new Date(currYear, currMonth, day);
    setSelectedDateObj(date);
    setDateInput(`${day} tháng ${currMonth + 1}`);
    setShowCalendar(false);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currMonth, currYear);
    const firstDay = getFirstDayOfMonth(currMonth, currYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-9 h-9"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
        selectedDateObj &&
        selectedDateObj.getDate() === i &&
        selectedDateObj.getMonth() === currMonth &&
        selectedDateObj.getFullYear() === currYear;

      const isToday =
        i === today.getDate() &&
        currMonth === today.getMonth() &&
        currYear === today.getFullYear();

      days.push(
        <button
          key={i}
          onClick={() => handleSelectDate(i)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition font-medium
            ${isSelected
              ? "bg-blue-100 text-blue-700 font-bold"
              : "text-gray-700 hover:bg-gray-100"
            }
            ${!isSelected && isToday ? "text-blue-600 font-bold bg-gray-50" : ""}
          `}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

      {/* --- MODAL CONTAINER --- */}
      <div className="bg-white w-full max-w-[550px] rounded-xl shadow-2xl overflow-visible animate-zoom-in flex flex-col">

        {/* --- Header --- */}
        <div className="flex justify-end p-3 pb-0">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:cursor-pointer">
            <RxCross2 size={24} />
          </button>
        </div>

        {/* --- Body --- */}
        <div className="px-6 pb-6 space-y-5 flex-1 relative">

          {/* === 1. PHẦN TIÊU ĐỀ === */}
          <div className="group relative">
            <div className="ml-[3.2rem]">
              <input
                type="text"
                placeholder="Thêm tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-medium text-gray-800 placeholder-gray-400 focus:outline-none pb-3 bg-transparent relative z-10"
                autoFocus
              />
              <div className="relative bottom-0 left-0 w-full h-[1px] bg-gray-200"></div>
              <div className="relative bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-focus-within:w-full z-20"></div>
            </div>
          </div>

          {/* === 2. NGÀY & GIỜ === */}
          <div className="flex items-start gap-4">
            <div className="p-2 text-gray-600 mt-1">
              <MdOutlineWatchLater size={22} />
            </div>

            <div className="flex flex-wrap gap-3 items-center w-full relative">

              {/* --- INPUT NGÀY --- */}
              <div className="relative group" ref={calendarRef}>
                <input
                  type="text"
                  placeholder="Ngày"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  onFocus={() => setShowCalendar(true)}
                  className="bg-gray-100 text-gray-700 font-medium text-sm px-4 py-2.5 rounded hover:bg-gray-200 transition focus:outline-none w-[140px]"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-focus-within:w-full rounded-b"></div>

                {/* --- BẢNG LỊCH --- */}
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.15)] border border-gray-100 p-4 w-[320px] z-[60] animate-fadeIn">

                    {/* Header Lịch */}
                    <div className="flex items-center justify-between mb-4 px-2">
                      <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition"><FiChevronLeft size={20} /></button>
                      <span className="font-bold text-sm text-gray-700">Tháng {currMonth + 1} năm {currYear}</span>
                      <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition"><FiChevronRight size={20} /></button>
                    </div>

                    {/* Thứ */}
                    <div className="grid grid-cols-7 mb-2 text-center text-xs text-gray-500 font-semibold">
                      {daysOfWeek.map(d => <div key={d}>{d}</div>)}
                    </div>

                    {/* Ngày */}
                    <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                      {renderCalendarDays()}
                    </div>
                  </div>
                )}
              </div>

              {/* --- INPUT GIỜ --- */}
              <div className="relative group" ref={timeRef}>
                <input
                  type="text"
                  placeholder="Giờ"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  onFocus={() => setShowTimeDropdown(true)}
                  className="bg-gray-100 text-gray-700 font-medium text-sm px-4 py-2.5 rounded hover:bg-gray-200 transition  focus:outline-none w-[100px]"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-focus-within:w-full rounded-b"></div>

                {/* --- DANH SÁCH GIỜ --- */}
                {showTimeDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-[180px] max-h-[250px] overflow-y-auto bg-white text-gray-700 rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.15)] border border-gray-100 z-[60] custom-scrollbar py-2 animate-fadeIn">
                    {timeOptions.map((time) => (
                      <div
                        key={time}
                        onClick={() => {
                          setTimeInput(time);
                          setShowTimeDropdown(false);
                        }}
                        className={`px-4 py-2.5 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between
                            ${timeInput === time ? "bg-blue-50 text-blue-700 font-medium" : ""}
                          `}
                      >
                        {time}
                        {timeInput === time && <FiCheck size={14} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>


            </div>
          </div>
          {/* Checkbox */}
          <div className="ml-[3.2rem]">
            <label className="flex items-center gap-2 cursor-pointer ml-auto select-none p-2 rounded hover:bg-gray-50">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-700 focus:ring-cyan-700 cursor-pointer" />
              <span className="text-sm text-gray-500 font-medium">Cả ngày</span>
            </label>
          </div>


          {/* === 3. LẶP LẠI (Dropdown) === */}
          <div className="flex items-start gap-4 relative z-50">
            <div className="p-2 text-gray-600 mt-1"><FiRepeat size={22} /></div>
            <div className="relative group">
              <button
                onClick={() => { setIsRepeatOpen(!isRepeatOpen); setIsListOpen(false); }}
                className="flex items-center justify-between gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2.5 rounded transition cursor-pointer min-w-[160px] focus:outline-none"
              >
                <span>{selectedRepeat}</span>
                <FiChevronDown size={16} className={`transition-transform duration-200 ${isRepeatOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 rounded-b ${isRepeatOpen ? "w-full" : "w-0 group-focus-within:w-full"}`}></div>

              {isRepeatOpen && (
                <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fadeIn origin-top-left">
                  {repeatOptions.map((item) => (
                    <div
                      key={item}
                      onClick={() => { setSelectedRepeat(item); setIsRepeatOpen(false); }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    >
                      <span>{item}</span>
                      {selectedRepeat === item && <FiCheck className="text-cyan-700" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* === 4. MÔ TẢ === */}
          <div className="flex items-start gap-4 relative z-0">
            <div className="p-2 text-gray-600 mt-1"><MdOutlineDescription size={22} /></div>
            <div className="w-full relative group">
              <textarea
                rows={3}
                placeholder="Thêm nội dung mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-100 text-gray-800 rounded-lg rounded-b-none p-3 text-sm focus:outline-none resize-none placeholder-gray-500 hover:bg-gray-200 transition relative z-10 block"
              />
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-focus-within:w-full z-20"></div>
            </div>
          </div>

          {/* === 5. DANH SÁCH (Dropdown) === */}
          <div className="flex items-center gap-4 relative z-40">
            <div className="p-2 text-gray-600"><MdOutlineFormatListBulleted size={22} /></div>
            <div className="relative group">
              <button
                onClick={() => { setIsListOpen(!isListOpen); setIsRepeatOpen(false); }}
                className="flex items-center justify-between gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2.5 rounded transition cursor-pointer min-w-[160px] focus:outline-none"

              >
                {selectedList}
                <FiChevronDown size={16} className={`transition-transform duration-200 ${isListOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 rounded-b ${isListOpen ? "w-full" : "w-0 group-focus-within:w-full"}`}></div>

              {isListOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fadeIn origin-top-left">
                  {listOptions.map((item) => (
                    <div
                      key={item}
                      onClick={() => { setSelectedList(item); setIsListOpen(false); }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    >
                      <span>{item}</span>
                      {selectedList === item && <FiCheck className="text-cyan-700" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50 mt-auto rounded-b-xl">
          <button
            onClick={onClose}
            className="hover:cursor-pointer bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-8 rounded-full transition shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;