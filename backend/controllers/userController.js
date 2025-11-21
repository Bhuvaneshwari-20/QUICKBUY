import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import twilio from "twilio";
import nodemailer from "nodemailer";
import crypto from "crypto";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const createToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 📱 REGISTER USER → SEND OTP
export const registerUser = async (req, res) => {
  try {
    const { name, email, phoneno, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword)
      return res.json({ success: false, message: "Passwords do not match" });
    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    const exists = await userModel.findOne({ phoneno, role });
    if (exists)
      return res.json({ success: false, message: "Phone already registered with this role" });

    const otp = Math.floor(100000 + Math.random() * 900000 ).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    // Send OTP via Twilio (or mock in dev)
    if (process.env.NODE_ENV === "development") {
      console.log(`📱 Mock OTP for ${phoneno}: ${otp}`);
    } else {
      await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phoneno}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name, email, phoneno, password: hashedPassword, otp, otpExpires, role
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
      userId: user._id,
      ...(process.env.NODE_ENV === "development" && { otp }), // show OTP in dev
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error sending OTP" });
  }
};

// ✅ VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.otp = null;
      await user.save();
      const token = createToken(user._id, user.role);
      return res.json({ success: true, token, role: user.role });
    } else {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


// 🔑 LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { phoneno, password, role } = req.body;
    
    const user = await userModel.findOne({ phoneno, role });
    if (!user) return res.json({ success: false, message: "User not found" });

    // Check if user is verified (otp is null means verified)
    if (user.otp) return res.json({ success: false, message: "Please verify your account first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = createToken(user._id, user.role);
    res.json({ success: true, token, role: user.role });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


// 🔒 FORGOT PASSWORD (EMAIL LINK)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.json({ success: false, message: "Email not found" });

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click below to reset your password:</p><a href="${resetURL}">${resetURL}</a>`,
  });

  res.json({ success: true, message: "Reset link sent to email" });
};

// 🔁 RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await userModel.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });
  if (!user) return res.json({ success: false, message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};

// 👤 GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-password -otp -otpExpires -resetToken -resetTokenExpires');
    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching profile" });
  }
};

// ✏️ UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phoneno, addresses, preferences, profileImage, dateOfBirth, gender } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phoneno) updateData.phoneno = phoneno;
    if (addresses) updateData.addresses = addresses;
    if (preferences) updateData.preferences = preferences;
    if (profileImage) updateData.profileImage = profileImage;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;

    const user = await userModel.findByIdAndUpdate(req.body.userId, updateData, { new: true }).select('-password -otp -otpExpires -resetToken -resetTokenExpires');

    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating profile" });
  }
};

// ➕ ADD USER ADDRESS
export const addUserAddress = async (req, res) => {
  try {
    const { type, street, city, state, zipcode, country, phone, isDefault } = req.body;

    const newAddress = { type, street, city, state, zipcode, country, phone, isDefault };

    // If this is the default address, unset other defaults
    if (isDefault) {
      await userModel.updateOne(
        { _id: req.body.userId },
        { $unset: { "addresses.$[].isDefault": false } }
      );
    }

    const user = await userModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { addresses: newAddress } },
      { new: true }
    ).select('-password -otp -otpExpires -resetToken -resetTokenExpires');

    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Address added successfully", data: user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding address" });
  }
};

// 🗑️ DELETE USER ADDRESS
export const deleteUserAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.body.userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    ).select('-password -otp -otpExpires -resetToken -resetTokenExpires');

    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Address deleted successfully", data: user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error deleting address" });
  }
};

// 📋 GET USER ORDER HISTORY
export const getUserOrderHistory = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching order history" });
  }
};

// 🔄 REORDER FROM HISTORY
export const reorderFromHistory = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order || order.userId.toString() !== req.body.userId) {
      return res.json({ success: false, message: "Order not found or unauthorized" });
    }

    // Add items to cart (this would typically be handled by cart controller)
    // For now, just return the order items
    res.json({ success: true, message: "Reorder initiated", data: order.items });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error reordering" });
  }
};
