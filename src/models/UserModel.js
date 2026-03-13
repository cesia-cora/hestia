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
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Field cannot be empty."
            },
            min: {
                args: 10,
                msg: "Username can only have 10 characters as minimum."
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Field cannot be empty."
            },
            isEmail: {
                args: true,
                msg: "Must be a valid email address."
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Field cannot be empty."
            },
            min: {
                args: 10,
                msg: "Password can only have 10 characters."
            }
        }
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: false,
});

UserModel.belongsToMany(RecipeModel, { through: 'createdBy' } )

module.exports = UserModel;