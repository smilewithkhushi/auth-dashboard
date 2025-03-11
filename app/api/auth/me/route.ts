import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/userModel"

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get("token")?.value
    
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Connect to database
    await connectDB()
    
    // Find user from decoded token
    const user = await User.findById(decoded.id).select("-password")
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in me route:", error)
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}