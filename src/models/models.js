const db = require('./db');

const { DataTypes } = require('sequelize');

const CategoryModel = db.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING,
        key: true,
    },
}, {
    timestamps: false
});

const RecipeModel = db.define('recipes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: "Title cannot be empty",
            },
            min: {
                args: 5,
                msg: "Title can only have 5 characters as minimum"
            }
        }
    },
    content: {
        type: DataTypes.TEXT,
        validate: {
            notEmpty: {
                args: true,
                msg: "Content is a required field",
            },
            min: {
                args: 5,
                msg: "Content can only have 5 characters as minimum"
            }
        }
    },
    image: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: "Image field is required",
            },
        },
    },
    category: {
        type: DataTypes.STRING,
        key: true,
    },
    createdBy: {
        type: DataTypes.STRING
    }
});

const IngredientModel = db.define('ingredients', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    unit: {
        type: DataTypes.INTEGER,
        allowNull: true,
	unique: false
   },
   unitType: {
	type: DataTypes.STRING,
	allowNull: false,
	unique: false
   },
}, {
    timestamps: false
});

CategoryModel.hasMany(RecipeModel, {
    foreignKey: 'category',
    as: 'categories_recipes',
    onDelete: 'CASCADE'
});

RecipeModel.belongsTo(CategoryModel, {
    foreignKey: 'category',
    as: 'FK_recipes_categories',
    onDelete: 'CASCADE'
})

RecipeModel.belongsToMany(IngredientModel, {
    through: 'recipe_ingredients',
    as: 'FK_recipes_ingredients',
    foreignKey: 'recipeId',
    otherKey: 'ingredientId',
    onDelete: 'CASCADE',
    timestamps: false,
});

IngredientModel.belongsToMany(RecipeModel, {
    through: 'recipe_ingredients',
    as: 'FK_ingredients_recipes',
    foreignKey: 'ingredientId',
    otherKey: 'recipeId',
    onDelete: 'CASCADE',
    timestamps: false,
});

module.exports = { CategoryModel, RecipeModel, IngredientModel };