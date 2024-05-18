import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ProductClaim from "../models/productClaimModel.js";

const app = express();

const getClaimsByUser = asyncHandler(async (req, res) => {
  const productClaims = await ProductClaim.find({ User: req.params.id });
  if (productClaims) {
    res.status(200);
    res.json(productClaims);
  } else {
    res.status(400);
    throw new Error("Error in getting claims");
  }
});

export { getClaimsByUser };
