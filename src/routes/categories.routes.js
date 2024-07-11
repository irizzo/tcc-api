/* category routes
	app.get('/categories', userCategoriesController.getAllCategories); // list all categories
	app.post('/categories', userCategoriesController.createNewCategory); // create new category

	app.get('/categories/:categoryCode', userCategoriesController.getCategoryByCode); // get category details 
	app.put('/categories/:categoryCode', userCategoriesController.updateCategory);
	app.delete('/categories/:categoryCode', userCategoriesController.deleteCategory);

*/

const express = require('express')
const router = express.Router()

const categoriesController = require('../controllers/userCategoriesController');

router
	.route('/')
	.get(categoriesController.getAllCategories)
	.post(categoriesController.createNewCategory)

router
	.route('/:categoryId')
	.get(categoriesController.getCategoryByCode)
	.put(categoriesController.updateCategory)
	.delete(categoriesController.deleteCategory)

module.exports = router
