import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ProductClaim from "../models/productClaimModel.js";
import Product from "../models/productModel.js";

const app = express();

const getClaimsByUser = asyncHandler(async (req, res) => {
  try {
    const productClaims = await ProductClaim.find({ User: req.params.id });
    if (!productClaims) {
      return res.status(400).json({ message: "Error in getting claims" });
    }

    // Use map and Promise.all for handling asynchronous operations
    const updatedClaims = await Promise.all(
      productClaims.map(async (claim) => {
        if (claim.Product) {
          const product = await Product.findById(claim.Product);
          claim.Product = product;
        }
        return claim;
      })
    );

    res.status(200).json(updatedClaims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const createProductClaim = asyncHandler(async (req, res) => {
  const { description, type, Product, User } = req.body;

  // Validate required fields
  if (!description || !Product || !User) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const productClaim = new ProductClaim({
      description,
      type,
      Product,
      User,
    });

    const createdProductClaim = await productClaim.save();
    res.status(201).json(createdProductClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { getClaimsByUser, createProductClaim };
