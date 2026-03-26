import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";
import CryptoJS from "crypto-js";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ROOT_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ROOT_ADMIN_PASSWORD;
const SECRET_KEY = process.env.AUTH_SECRET || "default_secret_key_hms_123";

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing required environment variables in .env.local");
  process.exit(1);
}

// Inline Encryption Utility (since scripts run in isolation)
const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

// Simplified Schemas for seeding
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plainPasswordEncrypted: { type: String },
  role: { type: String, enum: ["ADMIN", "DOCTOR", "PATIENT", "PHARMACY"], default: "PATIENT" },
  profileRef: { type: mongoose.Schema.Types.ObjectId, refPath: "profileModel" },
  profileModel: { type: String, enum: ["Patients", "Doctors", "StaffProfiles"] },
}, { timestamps: true });

const staffProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String },
  experience: { type: String },
}, { timestamps: true });

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Connected successfully.");

    const User = mongoose.models.Users || mongoose.model("Users", userSchema);
    const StaffProfile = mongoose.models.StaffProfiles || mongoose.model("StaffProfiles", staffProfileSchema);

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`ℹ️ Admin user with email ${ADMIN_EMAIL} already exists.`);
      process.exit(0);
    }

    console.log("Preparing credentials...");
    const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD as string, 12);
    const encryptedPassword = encryptPassword(ADMIN_PASSWORD as string);

    console.log("Creating admin account...");
    const adminUser = await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      plainPasswordEncrypted: encryptedPassword,
      role: "ADMIN",
      profileModel: "StaffProfiles",
    });

    console.log("Creating admin profile...");
    const adminProfile = await StaffProfile.create({
      userId: adminUser._id,
      name: "Root Administrator",
      phone: "+1000000000",
      specialization: "System Infrastructure",
      experience: "10+ Years",
    });

    adminUser.profileRef = adminProfile._id;
    await adminUser.save();

    console.log("🎉 Admin seeded successfully with secure encryption!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
