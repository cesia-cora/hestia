const { connection } = require('../models/connection');
const sharp = require('sharp');
const { CategoryModel, RecipeModel } = require('../models/models');
const UserModel = require('../models/UserModel');
const path = require('path');
const Sequelize = require('sequelize');
const { paginate } = require('../models/paginate');

const index = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = paginate(page, size);

    const recipes = await RecipeModel.findAndCountAll({
        limit: limit,
        offset: offset,
    });

    const totalRecipes = recipes.count;

    const totalPages = Math.ceil(totalRecipes / limit);
    const currentPage = parseInt(page) || 1;

    res.render('recipes/index', {
        recipes: recipes.rows,
        user: req.session.userId,
        username: req.session.username,
        totalPages: totalPages,
        currentPage: currentPage
    })
};

const search = async (req, res) => {
    const searchTerm = req.query.q;
    const recipes = await RecipeModel.findAll(
        {
            where: {
                title: {
                    [Sequelize.Op.like]: `%${searchTerm}%`
                }
            }
        }
    );
    res.render('recipes/search', { recipes: recipes, q: searchTerm, user: req.session.userId, username: req.session.username })
}

const create = (req, res) => {
    res.render('recipes/create', { values: {}, user: req.session.userId, username: req.session.username });
};

const store = async (req, res) => {
    console.log(req.file);
    try {
        await sharp(req.file.buffer)
            .resize(1000)
            .toFile(
                path.join(__dirname, `../../public/uploads/${req.file.originalname}`)
            );

        await RecipeModel.create({
            ...req.body,
            image: req.file.originalname,
            createdBy: req.session.username
        }, {
            include: [{
                model: CategoryModel,
                foreignKey: 'category',
                as: 'FK_recipes_categories'
            }]
        });

        res.redirect('/recipes');
    } catch (error) {
        res.render('recipes/create', { values: req.body, errors: error.errors, user: req.session.userId, username: req.session.username });
        console.log(error);
    }
};

const show = async (req, res) => {
    const recipe = await RecipeModel.findByPk(req.params.id);
    res.render('recipes/show', { recipe: recipe, user: req.session.userId, username: req.session.username });
};

const categories = async (req, res) => {
    const categories = await CategoryModel.findAll();
    res.render('categories/categories', { categories: categories, user: req.session.userId, username: req.session.username })
};

const category = async (req, res) => {
    const category_id = await CategoryModel.findByPk(req.params.id);
    const recipes = await RecipeModel.findAll({ where: { category: category_id.category }, user: req.session.userId, username: req.session.username })
    res.render('categories/category', { recipes: recipes, category: category_id.category, user: req.session.userId, username: req.session.username })
}

const myrecipes = async (req, res) => {
    const userId = await UserModel.findByPk(req.params.id);
    const recipes = await RecipeModel.findAll({ where: { createdBy: userId.username }, user: req.session.userId, username: req.session.username })
    res.render('profile/profile', { recipes: recipes, user: userId.username, user: req.session.userId, username: req.session.username })
}

const edit = async (req, res) => {
    const recipe = await RecipeModel.findByPk(req.params.id);
    res.render('recipes/edit', { recipe: recipe, user: req.session.userId, username: req.session.username });
};

const update = async (req, res) => {
    await RecipeModel.update(
        req.body,
        { where: { id: req.params.id } },
        {
            include: CategoryModel
        }
    );

    res.redirect('/recipes');
};

const update_image = async (req, res) => {
    await sharp(req.file.buffer)
        .resize(1000)
        .toFile(
            path.join(__dirname, `../../public/uploads/${req.file.originalname}`)
        );

    await RecipeModel.update(
        {
            ...req.body,
            image: req.file.originalname,
        },
        { where: { id: req.params.id } }
    );
    res.redirect('/recipes');
};

const destroy = async (req, res) => {
    await RecipeModel.destroy({ where: { id: req.params.id }, user: req.session.userId, username: req.session.username })
    res.redirect('/recipes');
};

module.exports = {
    index,
    search,
    create,
    store,
    show,
    edit,
    update,
    update_image,
    destroy,
    categories,
    category,
    myrecipes
};