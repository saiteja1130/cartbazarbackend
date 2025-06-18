import express from "express";
import {
  addToCart,
  addToWishList,
  getAllCartItems,
  getAllWishList,
  getUserDetails,
  login,
  register,
  removeFromCart,
} from "../Controller/userController.js";
import { verifyToken } from "../MiddleWare/verifyToken.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/get-user", verifyToken, getUserDetails);
userRoute.post("/addtocart", addToCart);
userRoute.get("/getcart", getAllCartItems);
userRoute.post("/removefromcart", removeFromCart);
userRoute.post("/addtowishlist", addToWishList);
userRoute.get("/getwishlist", getAllWishList);

export default userRoute;
