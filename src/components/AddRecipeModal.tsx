import React, { useState } from 'react'
import { Ingredient, Recipe, Step } from '../models'
import Modal from './Modal'
import TextArea from './TextArea'
import Input from './Input'
import AddIngredientModal from './AddIngredientModal'
import AddStepModal from './AddStepModal'

type AddRecipeModalProps = {
  open: boolean
  onClose: Function
  onSave: Function
}

function AddRecipeModal({ open, onClose, onSave }: AddRecipeModalProps) {
  // Recipe model
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [estTimeToMake, setEstTimeToMake] = useState<number>()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [steps, setSteps] = useState<Step[]>([])

  // Modal triggers
  const [isAddingIngredient, setIsAddingIngredient] = useState(false)
  const [isAddingStep, setIsAddingStep] = useState(false)

  function close() {
    setName("")
    setDescription("")
    setEstTimeToMake(undefined)
    setIngredients([])
    setSteps([])
    onClose()
  }

  function saveRecipe() {
    let recipe: Recipe = {
      id: 0,
      name,
      est_time_to_make_in_min: estTimeToMake ? estTimeToMake : 0,
      description,
      ingredients,
      steps
    }
    onSave(recipe)
    close()
  }

  function addIngredient(i: Ingredient) {
    setIngredients([...ingredients, i])
  }

  function removeIngredient(i: Ingredient) {
    const upd = ingredients.filter(ing => ing.name !== i.name && ing.amount !== i.amount)
    setIngredients(upd)
  }

  function addStep(s: Step) {
    setSteps([...steps, s])
  }

  function removeStep(s: Step) {
    const upd = steps.filter(step => s.number !== step.number)
    upd.forEach((step: Step, idx: number) => {
      step.number = idx + 1
    })
    setSteps(upd)
  }
  
  const footer = (
    <>
      <button type="button" onClick={() => saveRecipe()} className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
      <button type="button" onClick={() => close()} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
    </>
  )

  return (
    <Modal open={open} onClose={onClose} title="Add recipe" footer={footer}>
      <Input type="text" value={name} onChange={e => setName(e.target.value)} label="Name" />
      <TextArea value={description} onChange={e => setDescription(e.target.value)} label="Description" rows={5} />
      <Input type="number" value={estTimeToMake} onChange={e => setEstTimeToMake(Number(e.target.value))} label="Est. time to make (in minutes)" />
      <hr className="my-3" />
      <div className="font-bold">Ingredients</div>
      <div className="flex flex-col">
        {ingredients.length === 0 && <span className="italic text-gray-500">Add some ingredients!</span>}
        {ingredients.map((i: Ingredient) => (
          <div className="flex items-center bg-gray-100 p-2 rounded mt-1">
            <span className="flex-1">{i.name} ({i.amount})</span>
            <button onClick={() => removeIngredient(i)} className="hover:bg-slate-300 text-grey-darkest font-bold py-1 px-1 rounded-full inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>  
            </button>
          </div>
        ))}
        <div>
          <button onClick={() => setIsAddingIngredient(true)} className="bg-slate-50 hover:bg-slate-300 text-grey-darkest font-bold py-1 px-1 rounded-full inline-flex items-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>

      <hr className="my-3" />
      <div className="font-bold">Steps</div>      <div className="flex flex-col">
        {steps.length === 0 && <span className="italic text-gray-500">Add some steps!</span>}
        {steps.map((s: Step) => (
          <div className="flex flex-col bg-gray-100 p-2 rounded mt-1">
            <div className="flex items-center">
              <div className="flex-1 font-bold">Step {s.number}</div>
              <div>
                <button onClick={() => removeStep(s)} className="hover:bg-slate-300 text-grey-darkest font-bold py-1 px-1 rounded-full inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>  
                </button>
              </div>
            </div>
            <div>{s.directions}</div>
          </div>
        ))}
        <div>
          <button onClick={() => setIsAddingStep(true)} className="bg-slate-50 hover:bg-slate-300 text-grey-darkest font-bold py-1 px-1 rounded-full inline-flex items-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>

      <AddIngredientModal 
        open={isAddingIngredient} 
        onClose={() => setIsAddingIngredient(false)}
        onSave={addIngredient} />

      <AddStepModal
        open={isAddingStep}
        onClose={() => setIsAddingStep(false)}
        onSave={addStep} 
        order={steps.length + 1} />

    </Modal>
  )
}

export default AddRecipeModal