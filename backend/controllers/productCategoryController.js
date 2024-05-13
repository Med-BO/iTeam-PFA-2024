import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import ProductCategory from '../models/ProductCategoryModel.js';

const app = express();



const addCategory = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;
  
    const categoryExists = await ProductCategory.findOne({ name });
  
    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }
  
    const category = await ProductCategory.create({
      name,
      description,
      image
      
    });
    if (category) {
    
        res.status(201).json({
          _id: category._id,
          name: category.name,
          description: category.description,
          image: category.image
        });
      } else {
        res.status(400);
        throw new Error('Invalid category data');
      }

  });   

  const getAllProductCategories = asyncHandler(async (req, res) => {
    // Fetch all product categories from the database
    const productCategories = await ProductCategory.find();
    
    // Return the product categories as a JSON response
    res.json(productCategories);
  });


  const updateProductCategory = asyncHandler(async (req, res) => {
    const productCategory = await ProductCategory.updateOne({_id:req.params.id},
        {
            $set : req.body
        }
    )
    if (productCategory) {
    
        res.status(200);
        res.end( 'Product category updated');

      } else {
        res.status(400);
        throw new Error('Error in updating ');
      }
  });

  const deleteProductCategory = asyncHandler(async (req, res) => {
    // Find the product category by ID
    const productCategory = await ProductCategory.deleteOne({_id:req.params.id})
    if (productCategory) {
    
        res.status(200);
        res.end( 'Product category deleted');
      } else {
        res.status(400);
        throw new Error('Product category not deleted');
      }
});
  export{
     addCategory,
     getAllProductCategories,
     updateProductCategory,
     deleteProductCategory
   }