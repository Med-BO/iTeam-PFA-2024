import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Product from "../models/productModel.js";

const app = express();

const addProduct = asyncHandler(async (req, res) => {
  const { name, image, price, stock_quantity, Category } = req.body;

  const productExists = await Product.findOne({ name });

  if (productExists) {
    res.status(400);
    throw new Error("product already exists");
  }

  const product = await Product.create({
    name,
    image,
    price,
    stock_quantity,
    Category,
  });
  if (product) {
    res.status(201).json({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock_quantity: product.stock_quantity,
    });
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  const product = await Product.find();

  res.json(product);
});

const getOneProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (product) {
    res.status(201).json({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock_quantity: product.stock_quantity,
    });
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  if (product) {
    res.status(200);
    res.end("Product category updated");
  } else {
    res.status(400);
    throw new Error("Error in updating ");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  // Find the product category by ID
  const product = await Product.deleteOne({ _id: req.params.id });
  if (product) {
    res.status(200);
    res.end("Product deleted");
  } else {
    res.status(400);
    throw new Error("Product not deleted");
  }
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  // Fetch all products that belong to the specified category
  const products = await Product.find({ Category: category });

  if (products) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("No products found for this category");
  }
});

const getAllProductByCategoryName = asyncHandler(async (req, res) => {
  // get all the products by the category Id
  const products = await Product.find({ Category: req.params.categoryId });
  if (products) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("No products found for this category");
  }
});

export {
  addProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getOneProduct,
  getProductsByCategory,
  getAllProductByCategoryName
};
