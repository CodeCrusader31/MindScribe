//lib/config/db.js

// lib/config/db.js

// import mongoose from "mongoose";

// export const ConnectDB = async () => {
//   if (mongoose.connections[0].readyState) return;

//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB Connected");
//   } catch (err) {
//     console.error("MongoDB Connection Error:", err);
//   }
// };

// import mongoose from "mongoose";

// export const ConnectDB = async () => {
//   try {
//     if (mongoose.connection.readyState >= 1) return;

//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error);
//     throw error;
//   }
// };


import mongoose from "mongoose";

let cachedConnection = null;

export const ConnectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState >= 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  // Start connection and cache the promise
  cachedConnection = mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected");
      return mongoose.connection;
    })
    .catch((error) => {
      cachedConnection = null;
      console.error("MongoDB Connection Error:", error);
      throw error;
    });

  return cachedConnection;
};