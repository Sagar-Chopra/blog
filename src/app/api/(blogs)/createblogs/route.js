import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";

await connectDB();

const BlogSchema = new mongoose.Schema({
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

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { title, description, image, creator, creatorName } = body;
    console.log("Incoming Data:", title, description, creator, creatorName);

    if (!title || !description || !image || !creator || !creatorName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    if (!base64Regex.test(image)) {
      return NextResponse.json(
        { error: "Invalid image format. Use Base64 string." },
        { status: 400 }
      );
    }

    if (image.length > 5 * 1024 * 1024) { 
      return NextResponse.json(
        { error: "Image size too large. Max 5MB allowed." },
        { status: 400 }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      image,
      creator,
      creatorName,
    });
    await newBlog.save();

    return NextResponse.json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error in blog creation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
