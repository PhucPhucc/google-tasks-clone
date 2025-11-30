import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Nhớ hash password bằng bcrypt
  },
  {
    timestamps: true, // createdAt và updatedAt tự động thêm vào
  }
);

const User = mongoose.model('User', userSchema);
export default User;
