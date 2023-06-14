const express = require("express");
const router = express.Router();

const controller = require('../controllers/RecipeControllers');

router.get('/:id', controller.myrecipes);

module.exports = router;