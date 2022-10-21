import React, { useState } from 'react'
import { Recipe } from '../models'
import ViewRecipeModal from './ViewRecipeModal'

type RecipeCardProps = {
  recipe: Recipe
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const [isViewing, setIsViewing] = useState(false)

  return (
    <>
      <div onClick={() => setIsViewing(true)} className="hover:bg-slate-500 hover:cursor-pointer col-span-12 md:col-span-4 lg:col-span-3 p-3 bg-slate-700 rounded-md h-auto text-left">
        <h2>{recipe.name}</h2>
        <div className="mb-2">{recipe.description}</div>
        <div className="grid grid-cols-3 text-sm">
          <span className="mr-2 font-bold">Time to make:</span>
          <span className="mr-2 font-bold">Ingredients: </span>
          <span className="mr-2 font-bold">Steps: </span>
          <span> {recipe.est_time_to_make_in_min}min</span>
          <span> {recipe.ingredients ? recipe.ingredients.length : 'N/A'}</span>
          <span> {recipe.steps ? recipe.steps.length : 'N/A'}</span>
        </div>
      </div>
      
      <ViewRecipeModal 
        open={isViewing}
        onClose={() => setIsViewing(false)}
        recipe={recipe} />
    </>

  )
}

export default RecipeCard