const db = require("../models");
const uploadFilesMiddleware = require("../middlewares/uploadImg");

const Product = db.products;
const Category = db.categories;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  try {
    const imgUploadResult = await this.multipleUpload(req, res)
    if (imgUploadResult.errorMessage) {
      return res.status(500).send({ message: imgUploadResult.errorMessage })
    }
    const { price, name, categories } = req.body;
    if (!price || !name || !categories) {
      return res.status(500).send({ message: 'Invalid params' })
    }
    const newProduct = new Product({ name, price, categories, images: imgUploadResult.listImgUpload });
    newProduct.save()
    return res.status(200).send(newProduct)
  } catch (error) {
    return res.status(500).send({ error })
  }
  // Validate request
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  try {
    const { offset = 0, limit = 2 } = req.body;
    const skip = (offset * limit) + 1
    const result = await Product.find({}).skip(skip).limit(limit);
    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ error })
  }
};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  try {
    const { id = null } = req.params;
    console.log('🚀 ~ file: product.controller.js:41 ~ id:', id)
    if (!id) {
      return res.status(500).send({ message: 'Product Id invalid!' })
    }
    const result = await Product.findOne({ _id: id })
    if (!result) {
      return res.status(200).send({ message: 'Product not found' })
    }
    return res.status(200).send(result)
  } catch (error) {
    console.log('🚀 ~ file: product.controller.js:47 ~ error:', error)
    return res.status(500).send({ error })
  }
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  try {
    const { id = null } = req.params;
    if (!id) {
      return res.status(500).send({ message: 'Product Id invalid!' })
    };
    const imgUploadResult = await this.multipleUpload(req, res);
    const { price, name, categories } = req.body;
    await Product.findOneAndUpdate({ _id: id }, {
      price, name, categories, images: imgUploadResult.listImgUpload
    })
    const updatedProduct = await Product.findOne({ _id: id })
    return res.status(200).send(updatedProduct)
  } catch (error) {
    return res.status(500).send({ error })
  }
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const { id = null } = req.params;
    if (!id) {
      return res.status(500).send({ message: 'Product Id invalid!' })
    };
    const deleteProduct = await Product.findOneAndDelete({ _id: id })
    return res.status(200).send({ message: 'Delete successful!' })
  } catch (error) {
    return res.status(500).send({ error })
  }
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  return res.send(true)
};

exports.multipleUpload = async (req, res) => {
  let errorMessage;
  let listImgUpload = [];
  try {
    await uploadFilesMiddleware(req, res);
    listImgUpload = req.files.map(item => item.path)
    if (req.files.length <= 0) {
      errorMessage = 'You must select at least 1 file or more'
    }
  } catch (error) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      errorMessage = 'Exceeds the number of files allowed to upload.';
    }
    errorMessage = `Error when trying upload many files`
  }
  return {
    errorMessage,
    listImgUpload
  }
};

exports.findAllWithFilter = async (req, res) => {
  try {
    const { price, name, categories, offset = 0, limit = 2 } = req.query;
    const productFilter = {};
    const field = { price, name, categories };
    Object.keys(field).forEach(fieldName => {
      if (!!field[fieldName]) {
        productFilter[fieldName] = field[fieldName]
      }
    })
    const skip = (offset * limit) + 1
    const result = await Product.find({ productFilter }).skip(skip).limit(limit);
    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ error })
  }
};

exports.searchWithFilter = async (req, res) => {
  try {
    const { name, offset = 0, limit = 2 } = req.query;
    console.log('🚀 ~ file: product.controller.js:137 ~ exports.searchWithFilter= ~ req.query:', req.query)

    const skip = (offset * limit) + 1
    // const queryParam = `.*${name}.*`

    // console.log('🚀 ~ file: product.controller.js:141 ~ exports.searchWithFilter= ~ queryParam:', queryParam)
    const result = await Product.find({ 'name' : { '$regex' : name, '$options' : 'i' } }).skip(skip).limit(limit);
    return res.status(200).send(result)
  } catch (error) {
    console.log('🚀 ~ file: product.controller.js:145 ~ exports.searchWithFilter= ~ error:', error)
    return res.status(500).send({ error })
  }
};
