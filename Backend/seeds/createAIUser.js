const mongoose = require("mongoose");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

const AI_USER = {
  name: "AI Assistant",
  email: "ai@assistant.internal",
  password: process.env.AI_USER_PASSWORD || "ChangeMe!AI2024",
  pic: "https://icon-library.com/images/bot-icon/bot-icon-0.jpg",
  isAdmin: false,
};

async function seedAIUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingUser = await User.findOne({ email: AI_USER.email });
    if (existingUser) {
      console.log("AI user already exists.");
    } else {
      await User.create(AI_USER);
      console.log("AI user created successfully.");
    }
    process.exit();
  } catch (error) {
    console.error("Error seeding AI user:", error);
    process.exit(1);
  }
}

seedAIUser();
