import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ProductClaim from "../models/productClaimModel.js";
import Product from "../models/productModel.js";
import RepairProcedure from "../models/repairProcedureModel.js";

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

const getAllClaims = asyncHandler(async (req, res) => {
  try {
    // Retrieve all claims from the ProductClaim collection
    const productClaims = await ProductClaim.find();
    if (!productClaims) {
      return res.status(400).json({ message: "Error in getting claims" });
    }

    // Use map and Promise.all to handle asynchronous operations
    const updatedClaims = await Promise.all(
      productClaims.map(async (claim) => {
        if (claim.Product) {
          const product = await Product.findById(claim.Product);
          claim.Product = product;
        }
        if (claim.User) {
          const user = await mongoose.model("User").findById(claim.User);
          claim.User = user;
        }
        return claim;
      })
    );

    // Return the updated claims
    res.status(200).json(updatedClaims);
  } catch (error) {
    // Handle errors
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

const updateClaimStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["rejected", "in_repair", "done"];

  // Validate the new status
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const productClaim = await ProductClaim.findById(req.params.id);

    if (!productClaim) {
      return res.status(404).json({ message: "Product claim not found" });
    }

    // Update the status
    productClaim.statuss = status;
    const updatedProductClaim = await productClaim.save();
    if (status === "in_repair") {
      let repairProcedure = await RepairProcedure.findOne({ ProductClaim: productClaim._id });

      if (!repairProcedure) {
        repairProcedure = new RepairProcedure({
          statuss: "pending",
          Product: productClaim.Product,
          ProductClaim: productClaim._id,
        });

        await repairProcedure.save();
      } else {
        repairProcedure.statuss = "pending";
        await repairProcedure.save();
      }
    }

    res.status(200).json(updatedProductClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export { getClaimsByUser, createProductClaim, getAllClaims, updateClaimStatus };
