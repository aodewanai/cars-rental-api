const express = require("express");
const router = express.Router();
const CarController = require("../controllers/carController.js");


router.post("/add", CarController.addCar);
router.post("/edit", CarController.editCar);
router.delete("/:id", CarController.deleteCar);
router.get("/", CarController.getCars);
router.post("/", CarController.getCar);

module.exports = router;
