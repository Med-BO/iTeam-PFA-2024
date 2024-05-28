import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ProductBuy from "../models/productBuyModel.js";
import ProductInsurance from "../models/productInsuranceModel.js";
import moment from "moment";

const app = express();

const BuyProduct = asyncHandler(async (req, res) => {
  let {Product,User, contractType, ppd, stealProtection, beginDate, endDate } = req.body;

  beginDate = moment(beginDate, 'DD/MM/YYYY').toDate();
  endDate = moment(endDate, 'DD/MM/YYYY').toDate();
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
    User,
    date: Date.now(),
  });
  if (productBuy) {
    res.status(201).json(productBuy);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

export { BuyProduct };
