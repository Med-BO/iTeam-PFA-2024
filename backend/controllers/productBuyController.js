import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ProductBuy from "../models/productBuyModel.js";



const app = express();

const BuyProduct = asyncHandler(async (req, res) => {
  const { contractType, ppd, stealProtection, beginDate, endDate } = req.body;

    if (contractType) {
        // create insurance
        
    }
  const productBuy = await ProductBuy.create({
    contractType,
    ppd,
    stealProtection,
    User,
    Product,
    beginDate,
    endDate
  });
  if (productBuy) {
    res.status(201).json({
      contractType: product.contractType,
      ppd: product.ppd,
      stealProtection: product.stealProtection,
      beginDate: product.beginDate,
      endDate: product.endDate,

    });
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

export { BuyProduct };