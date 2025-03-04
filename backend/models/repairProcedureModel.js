import mongoose from 'mongoose';

const repairProcedureSchema = mongoose.Schema(
  {

    statuss: {
      type: String,
      enum: ['pending', 'done'],
    },
      Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      ProductClaim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductClaim',
        required: true
      }
  },
  {
    timestamps: true,
  }
);

const RepairProcedure = mongoose.model('RepairProcedure', repairProcedureSchema);

export default RepairProcedure;
