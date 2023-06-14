const express = require("express");
const router = express.Router();

const controller = require('../controllers/RecipeControllers');

router.get('/', controller.categories);
router.get('/:id', controller.category);

module.exports = router;