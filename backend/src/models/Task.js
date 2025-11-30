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

    // Trạng thái và độ ưu tiên
    isCompleted: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false }, // Dấu sao [cite: 124]
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    }, // [cite: 125]

    deadline: { type: Date }, // [cite: 123]

    // Logic lặp lại
    isRecurring: { type: Boolean, default: false },
    recurringPattern: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY', null],
      default: null,
    },

    // Người được giao task này (trong trường hợp List có nhiều người)
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true, // createdAt và updatedAt tự động thêm vào
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
