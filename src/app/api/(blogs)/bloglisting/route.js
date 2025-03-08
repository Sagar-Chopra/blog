import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Blogs = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export async function GET() {
  try {
    await connectDB();

    const blogs = await Blogs.find();

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
