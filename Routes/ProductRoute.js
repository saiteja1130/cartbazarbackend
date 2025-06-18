import express from "express";
import { getAllProducts } from "../Controller/ProductController.js";

const ProductRoute = express.Router();

ProductRoute.get("/get-products", getAllProducts);

export default ProductRoute;
