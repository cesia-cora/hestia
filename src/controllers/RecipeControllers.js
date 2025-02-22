const { connection } = require('../models/connection');
const sharp = require('sharp');
const { CategoryModel, RecipeModel } = require('../models/models');
const UserModel = require('../models/UserModel');
const path = require('path');
const Sequelize = require('sequelize');
const { paginate } = require('../models/paginate');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

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

const create = async (req, res) => {
    const categories = await CategoryModel.findAll();
    res.render('recipes/create', { categories: categories,values: {}, user: req.session.userId, username: req.session.username });
};

const store = async (req, res) => {
    console.log(req.file);
    try {
        const uniqueFileName = uuidv4() + '_' + req.file.originalname;
        await sharp(req.file.buffer)
            .resize(1000)
            .toFile(
                path.join(__dirname, `../../public/uploads/${uniqueFileName}`)
            );

        await RecipeModel.create({
            ...req.body,
            image: uniqueFileName,
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

const downloadPdf = async (req, res) => {

    try {
        const recipe = await RecipeModel.findByPk(req.params.id);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const htmlContent = `
        <h1 style="margin: 5% 5%;color:'indianred';font-family:'Trebuchet MS', sans-serif; text-decoration: underline palevioletred wavy">${recipe.title}</h1>
        <img style="margin: 1% 5%; width: 600px" src="http://localhost:3000/uploads/${recipe.image}">
        <h4 style="margin: 2% 5% 5% 5%;font-family:'Trebuchet MS', sans-serif; font-size:14px;">By: ${recipe.createdBy}</h4>
        <div style="margin: 2% 5%;font-family:'Trebuchet MS', sans-serif"">${recipe.content}</div>
    `;

        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: 'A4' });

        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
        res.send(pdf);

        await browser.close();
    } catch (error) {
        console.log(error)
    }
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
    myrecipes,
    downloadPdf
};