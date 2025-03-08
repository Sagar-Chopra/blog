import { connectDB } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please Fill All Fields" },
        { status: 400 }
      );
    }

    const userLogin = await User.findOne({ email });

    if (!userLogin) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign({ id: userLogin._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    cookies().set("jwtoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60,
    });

    return NextResponse.json({
      message: "Signin Successful",
      user: {
        _id: userLogin._id,
        name: userLogin.name,
        email: userLogin.email,
      },
      jwtoken: token,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
