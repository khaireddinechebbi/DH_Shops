"use server"

import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

import crypto from "crypto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const register = async (values: any) => {
  const { email, password, name, username } = values

  try {
    await connectDB()

    // Validate username format
    if (!username || typeof username !== 'string') {
      return { error: 'Username is required' }
    }

    const usernameStr = username.trim().toLowerCase()

    // Check username format
    if (!/^[a-z0-9_]+$/.test(usernameStr)) {
      return { error: 'Username can only contain lowercase letters, numbers, and underscores' }
    }

    // Check if username is already taken
    const usernameExists = await User.findOne({ username: usernameStr })
    if (usernameExists) {
      return { error: 'Username already exists' }
    }

    // Check if email is already taken
    const userFound = await User.findOne({ email })
    if (userFound) {
      return { error: 'Email already exists' }
    }

    // Generate unique userCode
    let userCode = crypto.randomBytes(4).toString('hex');
    let codeExists = await User.findOne({ userCode });
    while (codeExists) {
      userCode = crypto.randomBytes(4).toString('hex');
      codeExists = await User.findOne({ userCode });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      name,
      email,
      username: usernameStr,
      userCode,
      password: hashedPassword
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedUser = await user.save()
  } catch (error) {
    console.log(error)
    return { error: 'Registration failed. Please try again.' }
  }
}
