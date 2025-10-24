import type { Request, Response } from "express";
import { User } from "../models/user.models.js";
import { userProfileSchema } from "../validations/user.js";

interface MyRequestBody {
  username: string;
  password: string;
}

export const signup = async (
  req: Request<{}, {}, MyRequestBody>,
  res: Response
) => {
  const { username, password } = userProfileSchema.parse(req.body);

  // const users : z.infer<typeof userProfileSchema> = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  try {
    const user = await User.create({ username, password });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (
  req: Request<{}, {}, MyRequestBody>,
  res: Response
) => {
  const { username, password } = userProfileSchema.parse(req.body);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = user.generateJWT();
    res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Signin successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signout = async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie("token")
    .json({ message: "Signout successful" });
};
