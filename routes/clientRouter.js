const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/clientController.js");


router.post("/register", ClientController.addClient);
router.post("/", ClientController.getClient);
router.get("/", ClientController.getClients);

module.exports = router;
