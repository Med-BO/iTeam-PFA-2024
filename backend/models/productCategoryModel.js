import mongoose from 'mongoose';

const productCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
      //default: 'client',
    },
  },
  {
    timestamps: true,
  }
);

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

export default ProductCategory;
