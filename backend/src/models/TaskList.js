import mongoose from 'mongoose';

const taskListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // Owner là người tạo ra list
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Danh sách thành viên được chia sẻ
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['VIEWER', 'EDITOR'], // Viewer chỉ xem, Editor được sửa/thêm task
          default: 'VIEWER',
        },
        status: {
          type: String,
          enum: ['PENDING', 'ACCEPTED', 'REJECTED'], // Trạng thái lời mời
          default: 'PENDING',
        },
      },
    ],
  },
  {
    timestamps: true, // createdAt và updatedAt tự động thêm vào
  }
);

const TaskList = mongoose.model('TaskList', taskListSchema);
export default TaskList;
