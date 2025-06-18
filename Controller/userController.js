import bcrypt from "bcrypt";
import user from "../Modals/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await user.findOne({ email });
    if (existUser) {
      return res.send({
        success: false,
        message: "User Found with The provided email",
        name: existUser.name,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new user({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();
    const userObj = newUser.toObject();
    delete userObj.password;
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.send({
      success: true,
      message: "User Created",
      userDetails: { userId: userObj._id, token: token },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await user.findOne({ email });
    if (!existUser) {
      return res.send({ success: false, message: "No user found" });
    }
    const decodepass = await bcrypt.compare(password, existUser.password);
    if (!decodepass) {
      return res.send({ success: false, message: "Enter a Correct Password" });
    }
    const userObj = existUser.toObject();
    delete userObj.password;
    const token = jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET);
    res.send({
      success: true,
      message: "User Created",
      userDetails: { userId: userObj._id, token: token },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;

    const userDetails = await user.findById(userId).select("-password"); // exclude password

    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: userDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.send({
        message: "userId Undefined",
        success: false,
      });
    }
    const findUser = await user
      .findById({ _id: userId })
      .populate("cartItems.product");
    if (!findUser) {
      return res.send({
        message: "No user Found To Add Item To Cart",
        success: false,
      });
    }
    if (findUser.cartItems.length === 0) {
      return res.send({
        message: "Cart is Empty",
        success: true,
      });
    }
    const cartPrice = findUser.cartItems.reduce((total, item) => {
      const priceString = item.product.price;
      const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g, ""));
      return total + priceNumber * item.quantity;
    }, 0);
    res.send({
      success: true,
      data: findUser.cartItems,
      price: cartPrice,
    });
  } catch (error) {
    res.send({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!productId || !userId) {
      return res.send({
        message: "ProductId or userId is undefined",
        success: false,
      });
    }

    const findUser = await user.findById(userId);

    if (!findUser) {
      return res.send({
        message: "No user found to remove item from cart",
        success: false,
      });
    }

    const index = findUser.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index !== -1) {
      const item = findUser.cartItems[index];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        findUser.cartItems.splice(index, 1);
      }

      await findUser.save();

      return res.send({
        message: "Product removed from cart",
        success: true,
        data: findUser.cartItems,
      });
    } else {
      return res.send({
        message: "Product not found in cart",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.send({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};
export const addToCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    if (!productId || !userId) {
      return res.send({
        message: "ProductId or userId Undefined",
        success: false,
      });
    }
    const findUser = await user.findById({ _id: userId });
    if (!findUser) {
      return res.send({
        message: "No user Found To Add Item To Cart",
        success: false,
      });
    }
    const existIndex = await findUser.cartItems.findIndex((item) =>
      item.product.equals(productId)
    );
    if (existIndex !== -1) {
      findUser.cartItems[existIndex].quantity += 1;
    } else {
      findUser.cartItems.push({
        product: productId,
        quantity: 1,
      });
    }
    await findUser.save();
    res.send({
      message: "Added To Cart",
      success: true,
      data: findUser.cartItems,
    });
  } catch (error) {
    console.error(error);
    res.send({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};

export const addToWishList = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    if (!productId || !userId) {
      return res.send({
        message: "ProductId or userId Undefined",
        success: false,
      });
    }
    const findUser = await user.findById({ _id: userId });
    if (!findUser) {
      return res.send({
        message: "No user Found To Add Item To Cart",
        success: false,
      });
    }
    const item = findUser.wishList.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      findUser.wishList.push({
        product: productId,
      });
      await findUser.save();
      return res.send({
        message: "Product Added to Wishlist",
        success: true,
        wishListdata: findUser.wishList,
      });
    } else {
      findUser.wishList = findUser.wishList.filter(
        (data) => data.product.toString() !== productId
      );
      // findUser.wishList = wishListData;
      await findUser.save();
      return res.send({
        message: "Product removed from Wishlist",
        success: true,
        wishListdata: findUser.wishList,
      });
    }
  } catch (error) {
    console.error(error);
    res.send({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};

export const getAllWishList = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.send({
        message: "userId Undefined",
        success: false,
      });
    }
    const findUser = await user
      .findById({ _id: userId })
      .populate("wishList.product");
    if (!findUser) {
      return res.send({
        message: "No user Found",
        success: false,
      });
    }
    if (findUser.wishList.length === 0) {
      return res.send({
        message: "Wishlist is Empty",
        success: true,
      });
    }
    res.send({
      success: true,
      wishListData: findUser.wishList,
    });
  } catch (error) {
    res.send({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};
