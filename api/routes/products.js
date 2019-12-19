const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(products => {
      const response = {
        count: products.length,
        items: products.map(product => {
          return {
            name: product.name,
            price: product.price,
            _id: product._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + product._id
            }
          };
        })
      };

      //   if (products.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
router.post("/", checkAuth, (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then(product => {
      console.log("From database", product);
      if (product) {
        res.status(200).json({
          item: product,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.patch("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
router.delete("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;

  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
module.exports = router;
