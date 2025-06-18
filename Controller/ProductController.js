import { Product } from "../Modals/Products.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.send({
        message: "Unable to Fecth the Products",
        success: false,
        data: [],
      });
    }
    res.send({
      message: "Fecthed the Products",
      success: true,
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: error,
      success: false,
      data: [],
    });
  }
};
