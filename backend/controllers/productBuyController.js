import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ProductBuy from "../models/productBuyModel.js";
import ProductInsurance from "../models/productInsuranceModel.js";

const app = express();

const BuyProduct = asyncHandler(async (req, res) => {
  const { contractType, ppd, stealProtection, beginDate, endDate } = req.body;

  let productInsurance;
  if (contractType) {
    // create insurance
    productInsurance = await ProductInsurance.create({
      Product,
      User,
      contractType,
      ppd,
      stealProtection,
      beginDate,
      endDate,
    });
  }
  const productBuy = await ProductBuy.create({
    productInsurance: contractType ? productInsurance._id : null,
    Product,
    date: Date.now(),
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
