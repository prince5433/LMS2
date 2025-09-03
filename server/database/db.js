import mongoose from "mongoose";
const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
   await mongoose.connect(process.env.MONGO_URI);
   console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`Error in conectiong db: ${error.message}`);
  }
}
export default connectDB;