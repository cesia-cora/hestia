const db = require('./db');

const { DataTypes } = require('sequelize');

const RecipeModel = db.define('recipes', {
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
    },
    createdBy: {
        type: DataTypes.STRING
    }
});

module.exports = RecipeModel;