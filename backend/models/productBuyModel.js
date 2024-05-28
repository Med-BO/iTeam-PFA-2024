import mongoose from 'mongoose';

const productBuySchema = mongoose.Schema(
  {
    date: {
        type: Date,
    },
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ProductInsurance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductInsurance',
        required: false
    },
  },
  {
    timestamps: true,
  }
);

const ProductBuy = mongoose.model('ProductBuy', productBuySchema);

export default ProductBuy;
