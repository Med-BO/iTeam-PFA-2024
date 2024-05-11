import mongoose from 'mongoose';

const productClaimSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['stolen', 'broken'],
    },
    statuss: {
      type: String,
      enum: ['pending', 'rejected', 'in_repair', 'done'],
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
  },
  {
    timestamps: true,
  }
);

const ProductClaim = mongoose.model('ProductClaim', productClaimSchema);

export default ProductClaim;
