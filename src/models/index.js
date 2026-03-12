import CategoryModel from "./CategoryModel";
import RecipeModel from "./RecipeModel";
import IngredientModel from "./IngredientModel";

CategoryModel.hasMany(RecipeModel, {
    foreignKey: 'category'
})

RecipeModel.belongsToMany(IngredientModel, {
    through: 'recipe_ingredients',
    as: 'FK_recipes_ingredients'
})

export {CategoryModel, RecipeModel, IngredientModel};