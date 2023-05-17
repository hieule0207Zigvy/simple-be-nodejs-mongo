const db = require("../models");

const Cart = db.carts;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  try {
    const { user, products } = req.body;
    if (!user) {
      return res.status(500).send({ message: 'Invalid User Id' })
    }
    const newCart = new Cart({ user, products });
    newCart.save()
    return res.status(200).send(newCart)
  } catch (error) {
    return res.status(500).send({ error })
  }
  // Validate request
};

// // Retrieve all Tutorials from the database.
// exports.findAll = async (req, res) => {
//   try {
//     const result = await Category.find({})
//     return res.status(200).send(result)
//   } catch (error) {
//     return res.status(500).send({ error })
//   }
// };

// Delete a Tutorial with the specified id in the request
// exports.delete = async (req, res) => {
//   try {
//     const { id = null } = req.params;
//     if (!id) {
//       return res.status(500).send({ message: 'Category Id invalid!' })
//     };
//     await Category.findOneAndDelete({ _id: id })
//     return res.status(200).send({ message: 'Delete successful!' })
//   } catch (error) {
//     return res.status(500).send({ error })
//   }
// };

exports.update = async (req, res) => {
  try {
    const { id = null } = req.params;
    if (!id) {
      return res.status(500).send({ message: 'User Id invalid!' })
    };
    const { products } = req.body;
    const cartData = await Cart.findOne({ user: id });
    if (!cartData) {
      const newCart = new Cart({ user: id, products });
      await newCart.save();
      return res.status(200).send(newCart);
    }
    await Cart.findOneAndUpdate({ _id: cartData?.id }, { products })
    const updatedCart = await Cart.findOne({ _id: cartData })
    return res.status(200).send(updatedCart)
  } catch (error) {
    return res.status(500).send({ error })
  }
};


exports.findByUserId = async (req, res) => {
  try {
    const { id = null } = req.params;
    console.log('🚀 ~ file: cart.controller.js:66 ~ exports.findByUserId= ~ id:', id)
    if (!id) {
      return res.status(500).send({ message: 'User Id invalid!' })
    };
    const userCart = await Cart.findOne({ user: id }) || []
    console.log('🚀 ~ file: cart.controller.js:71 ~ exports.findByUserId= ~ userCart:', userCart)
    return res.status(200).send(userCart)
  } catch (error) {
    return res.status(500).send({ error })
  }
};
// Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//   return res.send(true)
// };
