import mongoose from 'mongoose';

const productInsuranceSchema = mongoose.Schema(
  {
    contractType: {
        type: String,
        enum: ['basic', 'standard', 'premium'],
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
    stealProtection: {
        type: Boolean,
        default: false
    },
    ppd: {
        type: Number,
        required: true
    },
    beginDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const ProductInsurance = mongoose.model('ProductInsurance', productInsuranceSchema);

export default ProductInsurance;
