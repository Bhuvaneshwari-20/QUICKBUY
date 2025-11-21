import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneno: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "staff", "admin"], default: "student" },
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetTokenExpires: Date,
  // Profile enhancements
  addresses: [{
    type: { type: String, enum: ["home", "work", "other"], default: "home" },
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    phone: String,
    isDefault: { type: Boolean, default: false }
  }],
  preferences: {
    dietaryRestrictions: [String],
    favoriteCuisines: [String],
    notifications: {
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      emailUpdates: { type: Boolean, default: true }
    }
  },
  profileImage: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"] },
  cartData: { type: Object, default: {} }
}, { timestamps: true });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
