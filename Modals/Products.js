import mongoose from "mongoose";

const baseProductSchema = new mongoose.Schema(
  {
    img: String,
    id: Number,
    name: String,
    brand: String,
    price: String,
    description: String,
    mainCategory: String,
    subCategory: String,
  },
  { discriminatorKey: "category", timestamps: true }
);

const Product = mongoose.model("Product", baseProductSchema);

// Mobiles
const mobileSchema = new mongoose.Schema({
  os: String,
  display: String,
  camera: String,
  battery: String,
});
mobileSchema.pre("save", function (next) {
  this.mainCategory = "Electronics";
  this.subCategory = "Mobiles";
  next();
});
const Mobile = Product.discriminator("latestMobiles", mobileSchema);

// Laptops
const laptopSchema = new mongoose.Schema({
  processor: String,
  display: String,
  ram: String,
  storage: String,
  battery: String,
});
laptopSchema.pre("save", function (next) {
  this.mainCategory = "Electronics";
  this.subCategory = "Laptops";
  next();
});
const Laptop = Product.discriminator("latestLaptops", laptopSchema);

// Cameras
const cameraSchema = new mongoose.Schema({
  sensor: String,
  video: String,
  autofocus: String,
  battery: String,
});
cameraSchema.pre("save", function (next) {
  this.mainCategory = "Electronics";
  this.subCategory = "Cameras";
  next();
});
const Camera = Product.discriminator("latestCameras", cameraSchema);

// Headphones
const headphoneSchema = new mongoose.Schema({
  type: String,
  battery: String,
  noiseCancelling: String,
});
headphoneSchema.pre("save", function (next) {
  this.mainCategory = "Electronics";
  this.subCategory = "Headphones";
  next();
});
const Headphone = Product.discriminator("latestHeadphones", headphoneSchema);

// Refrigerator
const refrigeratorSchema = new mongoose.Schema({
  capacity: String,
  type: String,
  energyRating: String,
});
refrigeratorSchema.pre("save", function (next) {
  this.mainCategory = "Appliances";
  this.subCategory = "Refrigerators";
  next();
});
const Refrigerator = Product.discriminator("refrigerators", refrigeratorSchema);

// Microwave
const microwaveSchema = new mongoose.Schema({
  capacity: String,
  type: String,
  power: String,
});
microwaveSchema.pre("save", function (next) {
  this.mainCategory = "Appliances";
  this.subCategory = "Microwaves";
  next();
});
const Microwave = Product.discriminator("microwaves", microwaveSchema);

// Washing Machine
const washingMachineSchema = new mongoose.Schema({
  capacity: String,
  type: String,
  energyRating: String,
});
washingMachineSchema.pre("save", function (next) {
  this.mainCategory = "Appliances";
  this.subCategory = "Washing Machines";
  next();
});
const WashingMachine = Product.discriminator(
  "washingMachines",
  washingMachineSchema
);

// Vacuum Cleaner
const vacuumSchema = new mongoose.Schema({
  power: String,
  type: String,
  batteryLife: String,
});
vacuumSchema.pre("save", function (next) {
  this.mainCategory = "Appliances";
  this.subCategory = "Vacuum Cleaners";
  next();
});
const VacuumCleaner = Product.discriminator("vacuumCleaners", vacuumSchema);

// Kids Top Wear
const topWearSchema = new mongoose.Schema({
  material: String,
  color: String,
  size: String,
  fit: String,
});
topWearSchema.pre("save", function (next) {
  if (this.category === "kidsTopWear") {
    this.mainCategory = "Kids";
    this.subCategory = "Top Wear";
  }
  if (this.category === "mensShirts") {
    this.mainCategory = "Men";
    this.subCategory = "Shirts";
  }
  if (this.category === "womensTops") {
    this.mainCategory = "Women";
    this.subCategory = "Tops";
  }
  next();
});
const KidsTopWear = Product.discriminator("kidsTopWear", topWearSchema);
const MensShirts = Product.discriminator("mensShirts", topWearSchema);
const WomensTops = Product.discriminator("womensTops", topWearSchema);

// Bottom Wear
const bottomWearSchema = new mongoose.Schema({
  material: String,
  color: String,
  size: String,
  fit: String,
});
bottomWearSchema.pre("save", function (next) {
  if (this.category === "kidsBottomWear") {
    this.mainCategory = "Kids";
    this.subCategory = "Bottom Wear";
  }
  if (this.category === "mensPants") {
    this.mainCategory = "Men";
    this.subCategory = "Pants";
  }
  if (this.category === "womenTrousers") {
    this.mainCategory = "Women";
    this.subCategory = "Trousers";
  }
  next();
});
const KidsBottomWear = Product.discriminator(
  "kidsBottomWear",
  bottomWearSchema
);
const MensPants = Product.discriminator("mensPants", bottomWearSchema);
const WomenTrousers = Product.discriminator("womenTrousers", bottomWearSchema);

// Shoes
const shoesSchema = new mongoose.Schema({
  type: String,
});
shoesSchema.pre("save", function (next) {
  if (this.category === "kidsShoes") {
    this.mainCategory = "Kids";
    this.subCategory = "Shoes";
  }
  if (this.category === "mensShoes") {
    this.mainCategory = "Men";
    this.subCategory = "Shoes";
  }
  if (this.category === "womensShoes") {
    this.mainCategory = "Women";
    this.subCategory = "Shoes";
  }
  next();
});
const KidsShoes = Product.discriminator("kidsShoes", shoesSchema);
const MensShoes = Product.discriminator("mensShoes", shoesSchema);
const WomensShoes = Product.discriminator("womensShoes", shoesSchema);

// Toys
const toySchema = new mongoose.Schema({
  ageGroup: String,
});
toySchema.pre("save", function (next) {
  this.mainCategory = "Kids";
  this.subCategory = "Toys";
  next();
});
const KidsToys = Product.discriminator("kidsToys", toySchema);

// Accessories
const accessorySchema = new mongoose.Schema({
  type: String,
  material: String,
  waterResistance: String,
  size: String,
});
accessorySchema.pre("save", function (next) {
  if (this.category === "mensAccessories") {
    this.mainCategory = "Men";
    this.subCategory = "Accessories";
  }
  if (this.category === "womensHandbags") {
    this.mainCategory = "Women";
    this.subCategory = "Handbags";
  }
  if (this.category === "womensJewelry") {
    this.mainCategory = "Women";
    this.subCategory = "Jewelry";
  }
  next();
});
const MensAccessories = Product.discriminator(
  "mensAccessories",
  accessorySchema
);
const WomensHandbags = Product.discriminator("womensHandbags", accessorySchema);
const WomensJewelry = Product.discriminator("womensJewelry", accessorySchema);

export {
  Product,
  Mobile,
  Laptop,
  Camera,
  Headphone,
  Refrigerator,
  Microwave,
  WashingMachine,
  VacuumCleaner,
  KidsTopWear,
  KidsBottomWear,
  KidsShoes,
  KidsToys,
  MensShirts,
  MensPants,
  MensShoes,
  MensAccessories,
  WomensTops,
  WomenTrousers,
  WomensShoes,
  WomensHandbags,
  WomensJewelry,
};
