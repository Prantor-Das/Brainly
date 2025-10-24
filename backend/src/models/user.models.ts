import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser {
  username: string;
  password: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateJWT(): string;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: [true, "Password is required"] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, username: this.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
