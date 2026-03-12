const { connection } = require('../models/connection');
const sharp = require('sharp');
const { CategoryModel, RecipeModel, IngredientModel } = require('../models/models');
const UserModel = require('../models/UserModel');
const path = require('path');
const Sequelize = require('sequelize');
const fs = require('fs').promises;
const { paginate } = require('../models/paginate');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('../utils/asyncHandler');

const index = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = paginate(page, size);

    const recipes = await RecipeModel.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [{ model: IngredientModel, as: 'FK_recipes_ingredients', through: { attributes: [] } }]
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
    const by = req.query.by;
    let recipes;
    if (by === 'ingredient') {
        recipes = await RecipeModel.findAll(
        {
            include: [{
                model: IngredientModel,
                as: 'FK_recipes_ingredients',
                where: {
                    name: {
                        [Sequelize.Op.like]: `%${searchTerm}%`} },
                    through: { attributes: [] }
                }]
            });
        } else {
            recipes = await RecipeModel.findAll({
                where: {
                    title: { 
                        [Sequelize.Op.like]: `%${searchTerm}%`
                    }
            },
            include: [{ model: IngredientModel, as: 'FK_recipes_ingredients', through: { attributes: [] } }]
        });
    }
    res.render('recipes/search', { recipes: recipes, q: searchTerm, user: req.session.userId, username: req.session.username })
}

const create = async (req, res) => {
    const categories = await CategoryModel.findAll();
    res.render('recipes/create', { categories: categories,values: {}, user: req.session.userId, username: req.session.username });
};

const store = async (req, res) => {
    const uniqueFileName = uuidv4() + '_' + req.file.originalname;
    const filePath = path.join(__dirname, `../../public/uploads/${uniqueFilename}`);
    console.log(req.file);

    await sharp(req.file.buffer)
        .resize(1000)
        .toFile(
            path.join(__dirname, `../../public/uploads/${uniqueFileName}`)
        );

    const t = await connection.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE });

    try {
        await RecipeModel.create({
            ...req.body,
            image: uniqueFileName,
            createdBy: req.session.username
        }, {
            include: [{
                model: CategoryModel,
                foreignKey: 'category',
                as: 'FK_recipes_categories'
            }],
            transaction: t
        });

        const names = (req.body.ingredients || '').split(',').map(s => s.trim()).filter(Boolean);
        const instances = await Promise.all(
            names.map(name => IngredientModel.findOrCreate({ where: { name }, transaction: t }).then(([inst]) => inst))
        );
        if (instances.length) await recipe.setFK_recipes_ingredients(instances, { transaction: t });

        await t.commit();
        res.redirect('/recipes');
    } catch (error) {
        await t.rollback();
        await fs.unlink(filePath).catch(() => {});
        res.render('recipes/create', { values: req.body, errors: error.errors, user: req.session.userId, username: req.session.username });
        console.log(error);
    }
};

const show = async (req, res) => {
    const recipe = await RecipeModel.findByPk(req.params.id, {
        include: [{ model: IngredientModel, as: 'FK_recipes_ingredients', through: { attributes: [] } }]
    });
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
    const recipe = await RecipeModel.findByPk(req.params.id, {
        include: [{  model: IngredientModel, as: 'FK_ingredients_recipes', through: { attributes: [] } }]
    });
    res.render('recipes/edit', { recipe: recipe, user: req.session.userId, username: req.session.username });
};

const update = async (req, res) => {
    const t = await connection.transaction();

    try {
        await RecipeModel.update(
            req.body,
            { where: { id: req.params.id }, transaction: t },
            {
                include: CategoryModel
            }
        );

        if (typeof req.body.ingredients !== 'undefined') {
            const recipe = await RecipeModel.findByPk(req.params.id, { transaction: t });
            const names = (req.body.ingredients || '').split(',').map(s => s.trim()).filter(Boolean);
            const instances = await Promise.all(
                names.map(name => IngredientModel.findOrCreate({ where: { name }, transaction: t }).then(([inst]) => inst))
            );
            await recipe.setFK_recipes_ingredients(instances, { transaction: t });
        }

        await t.commit();
        res.redirect('/recipes');
    } catch (error) {
        await t.rollback();
        res.render('recipes/edit', { recipe: { ...req.body, id: req.params.id }, errors: error.errors, user: req.session.userId, username: req.session.username });
        console.log(error);
    }
};

const update_image = async (req, res) => {
    const uniqueFileName = uuidv4() + '_' + req.file.originalname;
    const filePath = path.join(__dirname, `../../public/uploads/${uniqueFileName}`);

    await sharp(req.file.buffer)
        .resize(1000)
        .toFile(
            path.join(__dirname, `../../public/uploads/${req.file.originalname}`)
        );

    const t = await connection.transaction();

    try {
        await RecipeModel.update(
            {
                ...req.body,
                image: req.file.originalname,
            },
            { where: { id: req.params.id }, transaction: t }
        );

    await t.commit();
    res.redirect('/recipes');
    } catch (error) {
        await t.rollback();
        await fs.unlink(filePath).catch(() => {});
        res.render('recipes/edit', { recipe: { ...req.body, id: req.params.id }, errors: error.errors, user: req.session.userId, username: req.session.username });
        console.log(error);
    }
};

const destroy = async (req, res) => {
    const t = await connection.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE });
    try {
        const recipe = await RecipeModel.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
        if (!recipe) {
            await t.rollback();
            return res.status(404).send('Recipe not found');
        }
        await RecipeModel.destroy({ where: { id: req.params.id }, transaction: t });
        await t.commit();

        if (recipe.image) {
            const imgPath = path.join(__dirname, `../../public/uploads/${recipe.image}`);
            await fs.unlink(imgPath).catch(() => {});
        }

        res.redirect('/recipes');
    } catch (error) {
        await t.rollback();
        console.log(error);
    }
};

const downloadPdf = async (req, res) => {
    let browser;
    try {
        const recipe = await RecipeModel.findByPk(req.params.id);
        if (!recipe) return res.status(404).send('Recipe not found');
        browser = await puppeteer.launch();
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
    } finally {
        if (browser) await browser.close().catch(() => {});
    }
};

module.exports = {
    index: asyncHandler(index),
    search: asyncHandler(search),
    create: asyncHandler(create),
    store: asyncHandler(store),
    show: asyncHandler(show),
    edit: asyncHandler(edit),
    update: asyncHandler(update),
    update_image: asyncHandler(update_image),
    destroy: asyncHandler(destroy),
    categories: asyncHandler(categories),
    category: asyncHandler(category),
    myrecipes: asyncHandler(myrecipes),
    downloadPdf: asyncHandler(downloadPdf)
};