import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const app = express();

const loginInsuranceAccount = asyncHandler(async (req, res) => {
  const { email, password, userId } = req.body;

  const user = await User.findById(userId);

  const { insuranceEmail, insurancePassword } = user;
  const accountMatches =
    insuranceEmail === email && insurancePassword === password;

  if (!accountMatches) {
    res.status(401);
    throw new Error("Wrong credentials");
  } else {
    res.status(200);
    res.json({
      message: "Authentication successful",
    });
  }
});

export { loginInsuranceAccount };
