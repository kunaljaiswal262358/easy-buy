const { Product, validate } = require("../models/Product");

const getProducts = async (req, res) => {
  let query = createQuery(req.query);

  let sortOption = createSortObj(req.query);

  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * pageSize;

  const products = await Product.find(query)
    .sort(sortOption)
    .limit(pageSize)
    .skip(skip);


    const formattedProducts = products.map((product) => {
      const obj = product.toObject();

      if (obj.image && obj.image.data) 
        obj.image = `data:${obj.image.contentType};base64,${obj.image.data.toString("base64")}`;

      return obj;
    });

    res.send(formattedProducts);
};

function createQuery(obj) {
  let query = {}

  const {category, ratings, minPrice, maxPrice, search} = obj
  if(category) query.category = category;
  if(ratings) query.ratings = ratings;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.name = { $regex: search, $options: "i" };

  return query
}

function createSortObj(obj) {
  let sortOption = {}

  const {sortBy} = obj
  if (sortBy === "priceAsc") sortOption.price = 1;
  if (sortBy === "priceDesc") sortOption.price = -1;
  if (sortBy === "ratings") sortOption.ratings = -1;

  return sortOption
}

const getProductById = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("Product not found");
  }

  product  = product.toObject()
  product.image =  `data:${product.image.contentType};base64,${product.image.data}`
  res.send(product);
};

const registerProduct = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if(!req.file) return res.status(400).send("Image is required")
    
  const payload = {...req.body};
  payload.image = {
    data: req.file.buffer.toString("base64"),
    contentType: req.file.mimetype,
  };
  let product = new Product(payload);
  await product.save();

  product  = product.toObject()
  product.image =  `data:${product.image.contentType};base64,${product.image.data}`

  res.status(201).send(product);
};

const updateProduct = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if(!req.file) return res.status(400).send("Image is required")

  const payload = {...req.body};
  payload.image = {
    data: req.file.buffer.toString("base64"),
    contentType: req.file.mimetype,
  };
  let product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
  });

  if (!product)
    return res.status(404).json("Product with given id is not found");

  product  = product.toObject()
  product.image =  `data:${product.image.contentType};base64,${product.image.data}`

  res.send(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return res.status(404).send("Product with given id is not found");

  res.status(200).send(product);
};

module.exports = {
  getProducts,
  getProductById,
  registerProduct,
  updateProduct,
  deleteProduct,
};
