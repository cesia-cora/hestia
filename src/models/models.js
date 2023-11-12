const db = require('./db');

const { DataTypes } = require('sequelize');

const CategoryModel = db.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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

module.exports = { CategoryModel, RecipeModel };