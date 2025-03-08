import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creatorName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  console.log("delete request received");

  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    let decoded;
    console.log("Extracted Token:", token);

    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectDB();

    console.log("Blog ID from params:", params.id);

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blog.creator.toString() !== decoded.id) {
      return NextResponse.json(
        { error: "You can only delete your own blogs" },
        { status: 403 }
      );
    }

    await Blog.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
