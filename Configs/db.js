import mongoose from "mongoose";

const mongoDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("The DB is Connected");
    });
    await mongoose.connect(`${process.env.MONGO_CONNECT}/cartbazar`);
  } catch (error) {
    console.log(error.message);
  }
};

export default mongoDb;
