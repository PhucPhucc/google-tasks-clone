import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    taskListId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskList',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },

    // --- TRẠNG THÁI & ƯU TIÊN ---
    isCompleted: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },

    // --- NGÀY GIỜ & CẢ NGÀY ---
    // Thời hạn hoàn thành (lưu cả ngày và giờ)
    dueDateTime: { type: Date }, 
    
    // Nếu true -> UI chỉ hiển thị ngày, ẩn giờ. Logic backend sẽ lờ đi phần giờ.
    isAllDay: { type: Boolean, default: false }, 

    // Thời gian muốn hệ thống gửi thông báo (khác với deadline)
    reminderDateTime: { type: Date, default: null },

    // --- LOGIC LẶP LẠI NÂNG CAO (Recurrence) ---
    isRecurring: { type: Boolean, default: false },
    recurrence: {
      // Loại lặp: Hằng ngày, tuần, tháng, năm
      pattern: { 
        type: String, 
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        default: 'DAILY'
      },
      // Khoảng cách lặp (VD: số 2 nghĩa là "Mỗi 2 tuần")
      interval: { type: Number, default: 1 }, 
      
      // Dành cho lặp hàng tuần: Chọn thứ trong tuần (0=Chủ nhật, 1=Thứ 2...)
      // VD: Lặp thứ 2 và thứ 4 -> [1, 3]
      daysOfWeek: [{ type: Number, min: 0, max: 6 }], 
      
      // Ngày kết thúc lặp (nếu null là lặp vô tận)
      endDate: { type: Date, default: null },
      
      // Số lần lặp tối đa (VD: Lặp 10 lần rồi thôi)
      occurrences: { type: Number, default: null } 
    },

    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;