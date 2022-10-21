import { useState } from 'react'
import { Step } from '../models'
import Modal from './Modal'
import TextArea from './TextArea'

type Props = {
  open: boolean
  order: number
  onClose: Function
  onSave: Function
}

function AddStepModal({ order, open, onClose, onSave }: Props) {
  const [directions, setDirections] = useState("")

  function save() {
    const s: Step = {
      id: 0,
      number: order,
      directions
    }
    onSave(s)
    close()
  }

  function close() {
    setDirections("")
    onClose()
  }

  const footer = (
    <>
      <button type="button" onClick={() => save()} className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
      <button type="button" onClick={() => close()} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
    </>
  )

  return (
    <Modal open={open} onClose={onClose} title={`Step ${order}`} footer={footer}>
      <TextArea rows={5} value={directions} onChange={e => setDirections(e.target.value)} label="Directions" placeholder="Add the directions for this specific step here." />
    </Modal>
  )
}

export default AddStepModal