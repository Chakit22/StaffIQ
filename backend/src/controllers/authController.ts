
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

//LOGIN
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.name}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfJoining: user.dateOfJoining,
        avatarUrl: user.avatarUrl || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//REGISTER
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, avatarUrl } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (!["candidate", "lecturer"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role. Only 'candidate' or 'lecturer' allowed" });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepo.create({
      name,
      email,
      password: hashedPassword,
      role,
      avatarUrl: avatarUrl || null,
      dateOfJoining: new Date(),
    });

    await userRepo.save(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        dateOfJoining: newUser.dateOfJoining,
        avatarUrl: newUser.avatarUrl || null,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//UPDATE PROFILE (email + avatar)
export const updateUserProfile = async (req: Request, res: Response) => {
  const { id, email, avatarUrl } = req.body;

  if (!id || !email) {
    return res.status(400).json({ success: false, message: "ID and email are required" });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.email = email;
    user.avatarUrl = avatarUrl;

    const updatedUser = await userRepo.save(user);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        dateOfJoining: updatedUser.dateOfJoining,
        avatarUrl: updatedUser.avatarUrl || null,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
