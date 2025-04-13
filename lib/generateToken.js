import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
