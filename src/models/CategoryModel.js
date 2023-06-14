const db = require('./db');
const RecipeModel = require('./RecipeModel');

const { DataTypes } = require('sequelize');

const CategoryModel = db.define('categories', {
    category: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: "El título no puede estar vacío.",
            },
            min: {
                args: 5,
                msg: "El título solo puede tener como mínimo 5 caracteres."
            },
        },
    },
}, {
    timestamps: false
});

CategoryModel.belongsToMany(RecipeModel, { through: 'recipes_categories' } )

module.exports = CategoryModel;