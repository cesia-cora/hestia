import CategoryModel from "./CategoryModel";
import RecipeModel from "./RecipeModel";

CategoryModel.hasMany(RecipeModel, {
    foreignKey: 'category'
})

export {CategoryModel};