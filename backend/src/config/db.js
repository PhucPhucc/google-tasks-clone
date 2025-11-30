import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('connect DB successful');
  } catch (error) {
    console.log('error connect DB: ' + error);
    process.exit(1);
  }
};
