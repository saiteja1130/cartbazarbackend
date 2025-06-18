import mongoose from "mongoose";

const uri =
  "mongodb+srv://Saiteja:Saiteja1920@cartbazar.ec5ca4w.mongodb.net/?retryWrites=true&w=majority";

const connectAndCheck = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const admin = mongoose.connection.db.admin();
    const info = await admin.serverStatus();

    console.log("🧠 Cluster Info:");
    console.log("Host:", info.host);
    console.log("MongoDB Version:", info.version);
    console.log("Process Type:", info.process);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

connectAndCheck();
