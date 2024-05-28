import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import ProductInsurance from "../models/productInsuranceModel.js";
import moment from "moment";

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

const getUserContracts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const contracts = await ProductInsurance.find({ User: userId }).populate('Product');

  if (contracts) {
    const formattedContracts = contracts.map(contract => ({
      ...contract._doc,
      beginDate: moment(contract.beginDate).format("DD/MM/YYYY"),
      endDate: moment(contract.endDate).format("DD/MM/YYYY")
    }));

    res.status(200).json(formattedContracts);
  } else {
    res.status(404);
    throw new Error("No contracts found for this user");
  }
});

export {
  loginInsuranceAccount,
  getUserContracts,
};
