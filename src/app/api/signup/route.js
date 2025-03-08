import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
});

UserSchema.pre("save", async function (next) {
  console.log("in pre");
  if (this.isNew || this.isModified("password")) {
    console.log("Hashing passwords");
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

mongoose.models = {};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, cpassword } = body;
    
    if (!name || !email || !password || !cpassword) {
      return NextResponse.json({ error: "Please Fill All Fields" }, { status: 400 });
    }
    
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    
    if (password !== cpassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }
    const newUser = new User({ name, email, password, cpassword });
    console.log("Before save:", name, email, password, cpassword);
    
    await newUser.save();
    console.log("After save:", newUser);
    
    return NextResponse.json({ success: "Successfully registered" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}