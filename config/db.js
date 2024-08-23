import mongoose from 'mongoose';

export const connectDB = async () => {
  await mongoose
    .connect(
      'mongodb+srv://fsojodev:VZqTL5n9O4hctwou@cluster0.z8yjtkj.mongodb.net/food-del'
    )
    .then(() => console.log('DB Connected'));
};
