const express = require("express");
const router = express.Router();
const CarController = require("../controllers/carController.js");


router.post("/add", CarController.addCar);
router.get("/", CarController.getCars);
router.post("/", CarController.getCar);

module.exports = router;
