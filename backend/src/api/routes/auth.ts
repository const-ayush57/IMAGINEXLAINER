import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { authRateLimiter } from "../../middleware/rateLimiter";

export const authRouter = Router();

// Zod Input Schemas for Strict Sanitization checking against injection
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Helper for strict XSS-immune HTTP Only cookies
const setAuthCookie = (res: any, token: string) => {
  res.cookie("access_token", token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict", 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

authRouter.post("/register", authRateLimiter, async (req, res) => {
  try {
    // 1. Zod Validation 
    const { email, password } = registerSchema.parse(req.body);

    // 2. Uniqueness Lookups mapped via strictly-typed Drizzle
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "User already exists with this email." });
    }

    // 3. Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. PostgreSQL Database Write Sequence
    const [newUser] = await db.insert(usersTable).values({
      email,
      passwordHash,
    }).returning();

    // 5. Build and Sign Cryptographic token payload
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    setAuthCookie(res, token);
    res.status(201).json({ message: "Registration successful. Welcome to ImagineXplainer.", user: { email: newUser.email } });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

authRouter.post("/login", authRateLimiter, async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Comparing hashes avoiding timing attacks
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    setAuthCookie(res, token);
    
    res.status(200).json({ message: "Login strictly verified.", user: { email: user.email } });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: "Internal Server Error." });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Successfully logged out synchronously." });
});

import { requireAuth } from "../../middleware/auth";
authRouter.get("/me", requireAuth, async (req: any, res: any) => {
  try {
     const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
     if (!user) return res.status(401).json({ error: "No user found tracking contexts." });
     res.status(200).json({ user: { email: user.email } });
  } catch (err) {
     res.status(401).json({ error: "Invalid token validation mapped." });
  }
});
