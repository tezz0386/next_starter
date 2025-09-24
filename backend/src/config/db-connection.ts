import mongoose from 'mongoose';
async function connectDatabase() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test_app');
  console.log("Successfully Database Connected");
}
export default connectDatabase;