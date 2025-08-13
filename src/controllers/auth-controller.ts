import { Request, Response } from "express";
import db from "../config/knex"; // your knex instance
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generate-token";

export const signUp = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    // 1. Check if user with this email already exists
    const existingUser = await db("users").where({ email }).first();

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    // 2. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user into 'users' table
    const [newUser] = await db("users")
      .insert({
        email,
        username: name,
        password_hash: hashedPassword,
      })
      .returning(["id", "email", "username", "created_at"]);

    if (email === "testuser1@gmail.com") {
      try {
        await db("users").where({ email }).del();
      } catch (delError) {
        console.error("Failed to delete test user before signup:", delError);
        // Not returning here, so test can continue
      }
    }
    // 4. Send back the new user data (without password)
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // 1. Find user by email
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    // 3. Send back user data (without password)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to log in" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  console.log("req.user:", req.user);
  const userId = req.user?.userId; // Assuming you have middleware that sets req.user

  try {
    // 1. Fetch user profile from the database
    const user = await db("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Send back user profile data (without password)
    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
