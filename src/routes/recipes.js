const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const controller = require('../controllers/RecipeControllers');

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/store', upload.single('image'), controller.store);
router.get('/:id', controller.show);
router.get('/:id/edit', controller.edit);
router.put('/:id/update', controller.update);
router.put('/:id/update_image', upload.single('image'), controller.update_image)
router.delete('/:id/destroy', controller.destroy);

module.exports = router;