import React from 'react'
import { Recipe } from '../models'
import Modal from './Modal'

type Props = {
  open: boolean
  onClose: Function
  recipe: Recipe
}

function ViewRecipeModal({ open, onClose, recipe }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={recipe.name}>
      <div className="mb">
        {recipe.description}
      </div>
      <div className="italic text-gray-500 mb-4">
        Est. time to make: {recipe.est_time_to_make_in_min}min
      </div>
      <div className="mb-4">
        <h2>Ingredients:</h2>
        <ul>
          {recipe.ingredients && recipe.ingredients.map(i => <li key={`${recipe.id}-ing-${i.id}`}>{i.name} ({i.amount})</li>)}
        </ul>
      </div>
      <div>
        <h2>Directions:</h2>
        {recipe.steps && recipe.steps.map(s => (
          <div key={`${recipe.id}-step-${s.id}`} className="mb-4">
            <h3>Step {s.number}:</h3>
            <div>
              {s.directions}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default ViewRecipeModal