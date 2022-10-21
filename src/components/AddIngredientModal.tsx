import React, { useState } from 'react'
import { Ingredient } from '../models'
import Input from './Input'
import Modal from './Modal'

type Props = {
  open: boolean
  onClose: Function
  onSave: Function
}

function AddIngredientModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")

  function save() {
    const i: Ingredient = {
      id: 0,
      name,
      amount
    }
    onSave(i)
    close()
  }

  function close() {
    setName("")
    setAmount("")
    onClose()
  }

  const footer = (
    <>
      <button type="button" onClick={() => save()} className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
      <button type="button" onClick={() => close()} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
    </>
  )

  return (
    <Modal open={open} onClose={onClose} title="Add ingredient" footer={footer}>
      <Input type="text" value={name} onChange={e => setName(e.target.value)} label="Name" placeholder="Paprika" />
      <Input type="text" value={amount} onChange={e => setAmount(e.target.value)} label="Amount" placeholder="2 tsp" />
    </Modal>
  )
}

export default AddIngredientModal