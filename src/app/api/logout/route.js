import { connectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const token = cookies().get("jwtoken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "User already logged out" },
        { status: 200 }
      );
    }

    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.set("jwtoken", "", {
      expires: new Date(0),
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
