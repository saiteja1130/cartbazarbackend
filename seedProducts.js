import fs from "fs";
import path from "path";
import "dotenv/config";
import mongoDB from "./Configs/db.js";
import cloudinary from "./Configs/cloudConfig.js";
import {
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
} from "./Modals/Products.js";

const __dirname = path.resolve();
const filePath = path.join(__dirname, "products.json");

const categoryMap = {
  latestMobiles: Mobile,
  latestLaptops: Laptop,
  latestCameras: Camera,
  latestHeadphones: Headphone,
  refrigerators: Refrigerator,
  microwaves: Microwave,
  washingMachines: WashingMachine,
  vacuumCleaners: VacuumCleaner,
  kidsTopWear: KidsTopWear,
  kidsBottomWear: KidsBottomWear,
  kidsShoes: KidsShoes,
  kidsToys: KidsToys,
  mensShirts: MensShirts,
  mensPants: MensPants,
  mensShoes: MensShoes,
  mensAccessories: MensAccessories,
  womensTops: WomensTops,
  womenTrousers: WomenTrousers,
  womensShoes: WomensShoes,
  womensHandbags: WomensHandbags,
  womensJewelry: WomensJewelry,
};

const uploadToCloudinary = async (localImagePath) => {
  try {
    const result = await cloudinary.uploader.upload(localImagePath, {
      folder: "cartbazar/products",
    });
    return result.secure_url;
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error.message);
    return "";
  }
};

const seedProducts = async () => {
  try {
    await mongoDB();
    console.log("✅ Connected to DB");

    const rawData = fs.readFileSync(filePath);
    const productData = JSON.parse(rawData);

    for (const [category, items] of Object.entries(productData)) {
      const Model = categoryMap[category];
      if (!Model) {
        console.warn(`⚠️ No model found for category: ${category}`);
        continue;
      }

      for (const item of items) {
        const imageName = item.img; // Use image name from JSON
        const localImagePath = path.join(
          __dirname,
          "public",
          "images",
          imageName
        );

        if (!fs.existsSync(localImagePath)) {
          console.warn(`⚠️ Image not found: ${imageName}, skipping...`);
          continue;
        }

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(localImagePath);
        item.image = cloudinaryUrl;

        const product = new Model(item);
        await product.save();

        console.log(`✅ Inserted: ${item.name} -> ${cloudinaryUrl}`);
      }
    }

    console.log("🌱 All products seeded with Cloudinary images!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err.message);
    process.exit(1);
  }
};

seedProducts();
