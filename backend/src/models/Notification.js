import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người gửi lời mời

    type: {
      type: String,
      enum: ['INVITE_TO_LIST', 'DEADLINE_WARNING', 'TASK_ASSIGNED'],
      required: true,
    },

    // Link đến resource liên quan (Ví dụ: ID của List được mời)
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceModel: { type: String, enum: ['TaskList', 'Task'] },

    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt và updatedAt tự động thêm vào
  }
);

const Noti = mongoose.model('Notification', notificationSchema);
export default Noti;
