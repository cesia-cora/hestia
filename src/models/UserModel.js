const db = require('./db');
const RecipeModel = require('./RecipeModel')

const { DataTypes } = require('sequelize');

const UserModel = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false,
});

UserModel.belongsToMany(RecipeModel, { through: 'createdBy' } )

module.exports = UserModel;