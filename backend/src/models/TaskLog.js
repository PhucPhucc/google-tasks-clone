import mongoose from 'mongoose';

const taskLogSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'status_change', 'assign'],
      required: true,
    },

    // Dữ liệu trước khi thay đổi
    oldData: {
      type: Object,
      default: {},
    },

    // Dữ liệu sau khi thay đổi
    newData: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const TaskLog = mongoose.model('TaskLog', taskLogSchema);
export default TaskLog;
