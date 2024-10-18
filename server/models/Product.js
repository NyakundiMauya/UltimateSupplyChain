import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    category: String,
    rating: Number,
    supply: [{
      branchCode: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^[A-Z]{3}\d{3}$/.test(v);
          },
          message: props => `${props.value} is not a valid branch code!`,
        },
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
