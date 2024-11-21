const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    // Ensure you're awaiting the connection
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database connection error:", error.message); // Log the error message
    process.exit(1); // Exit the process if database connection fails
  }
};

module.exports = dbConnect;
