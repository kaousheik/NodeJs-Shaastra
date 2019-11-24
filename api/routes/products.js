const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handle GET request for products"
  });
});
router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "Handle POST request for products"
  });
});
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  if (id === "admin") {
    res.status(200).json({
      message: "Welcome ADMIN",
      id
    });
  } else {
    res.status(200).json({
      message: "Welcome User"
    });
  }
});
router.patch("/:id", (req, res, next) => {
  res.status(200).json({
    message: "Handle PATCH request for products"
  });
});
router.delete("/:id", (req, res, next) => {
  res.status(200).json({
    message: "Handle DELETE request for products"
  });
});
module.exports = router;
