import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ROOT_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ROOT_ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing required environment variables in .env.local");
  console.error({ MONGODB_URI: !!MONGODB_URI, ADMIN_EMAIL: !!ADMIN_EMAIL, ADMIN_PASSWORD: !!ADMIN_PASSWORD });
  process.exit(1);
}

// User Schema (matching src/models/Users.ts)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "DOCTOR", "PATIENT", "PHARMACIST"], default: "PATIENT" },
}, { timestamps: true });

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Connected successfully.");

    // Check if the user model already exists to avoid OverwriteModelError
    const User = mongoose.models.Users || mongoose.model("Users", userSchema);

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`ℹ️ Admin user with email ${ADMIN_EMAIL} already exists.`);
      process.exit(0);
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 12);

    console.log("Creating admin user...");
    await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    });

    console.log("🎉 Admin user created successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
