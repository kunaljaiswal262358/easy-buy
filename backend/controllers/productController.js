const Product = require('../models/Product');

// @desc   Get all products with filtering
// @route  GET /api/products
// @access Public
const getAllProducts = async (req, res) => {
  try {
    let query = {};

    // Filtering by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filtering by brand
    if (req.query.brand) {
      query.brand = req.query.brand;
    }

    // Filtering by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Filtering by rating
    if (req.query.minRating) {
      query.ratings = { $gte: Number(req.query.minRating) };
    }

    // Search by product name (case-insensitive)
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Sorting: price (low-high, high-low), ratings
    let sortOption = {};
    if (req.query.sortBy === 'priceAsc') sortOption.price = 1;
    if (req.query.sortBy === 'priceDesc') sortOption.price = -1;
    if (req.query.sortBy === 'rating') sortOption.ratings = -1;

    // Pagination
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * pageSize;

    // Fetch products from DB
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(skip);

    // product id
    const {productId} = req.params
    if(productId) {
      query._id = productId;
    }

    // Send response
    res.json({
      success: true,
      totalProducts: await Product.countDocuments(query),
      currentPage: page,
      totalPages: Math.ceil(await Product.countDocuments(query) / pageSize),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get a single product by ID
// @route  GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
      // Destructure the product details from the request body
      const { name, price, category, brand, stock, image } = req.body;

      let description = ""
      if(req.body.description)
          description = req.body.description

      // Check if all required fields are provided
      if (!name || !price || !category || !brand || !stock || !image ) {
          return res.status(400).json({ error: 'All fields are required except imageUrl and brand' });
      }

      // Create a new product instance
      const newProduct = new Product({
          name,
          description,
          price,
          category,
          brand,
          stock,
          image
      });

      // Save the product to the database
      const savedProduct = await newProduct.save();

      // Return a success response with the saved product details
      res.status(201).json({
          message: 'Product created successfully!',
          product: savedProduct
      });

    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
  }
};

// Controller to update an existing product by ID
const updateProduct = async (req, res) => {
  try {
      const { id } = req.params; // Get the product ID from the URL params
      const updateData = req.body; // Get the updated product details from the request body

      // Find the product by ID and update it with the new data
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

      // Check if the product was found and updated
      if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
      }

      // Send a success response with the updated product details
      res.status(200).json({
          message: 'Product updated successfully!',
          product: updatedProduct
      });

  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
  }
};


// Controller to delete a product by ID
const deleteProduct = async (req, res) => {
  try {
      const { id } = req.params; // Get the product ID from the URL params

      // Find and delete the product by its ID
      const deletedProduct = await Product.findByIdAndDelete(id);

      // Check if the product was found and deleted
      if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
      }

      // Send a success response confirming deletion
      res.status(200).json({
          message: 'Product deleted successfully!',
          product: deletedProduct
      });

  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
  }
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
