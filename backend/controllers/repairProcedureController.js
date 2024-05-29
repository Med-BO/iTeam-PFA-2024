import asyncHandler from "express-async-handler";
import RepairProcedure from "../models/repairProcedureModel.js";
import Product from "../models/productModel.js";
import ProductClaim from "../models/productClaimModel.js";

const updateRepairStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== "done" && status !== "pending") {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  const repair = await RepairProcedure.findById(id);
  if (!repair) {
    return res.status(404).json({ message: "Repair procedure not found." });
  }

  repair.statuss = status;
  await repair.save();

  if (status === "done") {
    const productClaim = await ProductClaim.findById(repair.ProductClaim);
    productClaim.statuss = "repair_complete";
    await productClaim.save();
  }

  res
    .status(200)
    .json({ message: "Repair status updated successfully.", repair });
});

const getAllRepairProcedures = asyncHandler(async (req, res) => {
  let repairProcedures = await RepairProcedure.find({});
  // Use Promise.all to await all async operations in parallel
  repairProcedures = await Promise.all(
    repairProcedures.map(async (element) => {
      element.Product = await Product.findById(element.Product);
      element.ProductClaim = await ProductClaim.findById(element.ProductClaim);
      return element;
    })
  );
  res.status(200).json(repairProcedures);
});

export { updateRepairStatus, getAllRepairProcedures };
