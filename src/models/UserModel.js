const db = require('./db');
const { RecipeModel } = require('./models')

const { DataTypes } = require('sequelize');

const UserModel = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
    },
    /*resetPasswordToken: {
        type: DataTypes.STRING,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
    }*/
}, {
    timestamps: false,
});

UserModel.belongsToMany(RecipeModel, { through: 'createdBy' } )

module.exports = UserModel;