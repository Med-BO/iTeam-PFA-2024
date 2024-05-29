import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ProductBuy from "../models/productBuyModel.js";
import ProductInsurance from "../models/productInsuranceModel.js";
import moment from "moment";
import ProductModel from "../models/productModel.js";

const app = express();

const BuyProduct = asyncHandler(async (req, res) => {
  let {
    Product,
    User,
    contractType,
    ppd,
    stealProtection,
    beginDate,
    endDate,
  } = req.body;

  beginDate = moment(beginDate, "DD/MM/YYYY").toDate();
  endDate = moment(endDate, "DD/MM/YYYY").toDate();
  let productInsurance;
  let hasInsurance = false;
  if (contractType != "none" && contractType != "") {
    hasInsurance = true;
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
    productInsurance: hasInsurance ? productInsurance._id : null,
    Product,
    User,
    date: Date.now(),
  });
  if (productBuy) {
    let insuranceAccount = {}
    // get the user
    const user = await mongoose.model("User").findById(User);
    if (user.has_bought == false) {
      user.insuranceEmail = user.email
      user.insurancePassword = generate_random_password(8)
      insuranceAccount = {
        email: user.insuranceEmail,
        password: user.insurancePassword
      }
      await user.save();
    }
    const product = await ProductModel.findById(Product);

    // Ensure product.quantity is a number
    const quantity = Number(product.stock_quantity);

    if (!isNaN(quantity)) {
      product.stock_quantity = quantity - 1;
    } else {
      throw new Error("Invalid quantity value");
    }
    await product.save();
    if (hasInsurance && user.has_bought == false) {
      user.has_bought = true;
      res.status(201).json({
        "productBuy": productBuy,
        "insuranceAccount": insuranceAccount
      });
    } else {
      res.status(201).json({
        "productBuy": productBuy
      });
    }
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

const generate_random_password = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { BuyProduct };
