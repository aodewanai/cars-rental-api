const express = require("express");
const router = express.Router();
const RentController = require("../controllers/rentController.js");


router.post("/add", RentController.addRent);
router.put("/close", RentController.closeRent);
router.get("/", RentController.getRents);
router.post("/", RentController.getRent);

module.exports = router;
