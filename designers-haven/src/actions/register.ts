"use server"

import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const register = async (values: any) => {
  const {email, password, name}  = values

  try {
    await connectDB()
    const userFound = await User.findOne({email})
    if (userFound) {
        return {error: 'Email already exists'}
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        name,
        email,
        password: hashedPassword
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedUser = await user.save()
  } catch (error) {
    console.log(error)
  }
}
