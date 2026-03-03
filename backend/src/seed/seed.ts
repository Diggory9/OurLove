import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import { SiteConfig } from "../models/SiteConfig";

async function seed() {
  await connectDB();

  // Seed admin
  const existingAdmin = await User.findOne({ username: "admin" });
  if (!existingAdmin) {
    await User.create({
      username: "admin",
      email: "admin@ourlove.com",
      password: "admin123456",
      role: "admin",
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  // Seed site config
  const existingConfig = await SiteConfig.findOne();
  if (!existingConfig) {
    await SiteConfig.create({
      siteName: "Our Love",
      person1Name: "Anh",
      person2Name: "Em",
      startDate: new Date("2024-01-01"),
      heroMessage: "Mỗi khoảnh khắc bên nhau đều là kỷ niệm đẹp nhất...",
      footerMessage: "Made with love",
      primaryColor: "#f43f5e",
    });
    console.log("Site config created");
  } else {
    console.log("Site config already exists");
  }

  await mongoose.connection.close();
  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
