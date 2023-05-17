const db = require("../models");

const Category = db.categories;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(500).send({ message: 'Invalid params' })
    }
    const newCategory = new Category({ name });
    newCategory.save()
    return res.status(200).send(newCategory)
  } catch (error) {
    return res.status(500).send({ error })
  }
  // Validate request
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  try {
    const result = await Category.find({})
    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ error })
  }
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const { id = null } = req.params;
    console.log('🚀 ~ file: category.controller.js:35 ~ exports.delete ~ id:', id)
    if (!id) {
      return res.status(500).send({ message: 'Category Id invalid!' })
    };
    await Category.findOneAndDelete({ _id: id })
    return res.status(200).send({ message: 'Delete successful!' })
  } catch (error) {
    return res.status(500).send({ error })
  }
};

exports.update = async (req, res) => {
  try {
    const { id = null } = req.params;
    if (!id) {
      return res.status(500).send({ message: 'Category Id invalid!' })
    };
    const { name } = req.body;
    await Category.findOneAndUpdate({ _id: id }, {
      name
    })
    const updatedCategory = await Category.findOne({ _id: id });
    return res.status(200).send(updatedCategory)
  } catch (error) {
    return res.status(500).send({ error })
  }
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  return res.send(true)
};
