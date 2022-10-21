import React from 'react'

type Props = {
  value: any
  onChange: React.ChangeEventHandler<HTMLInputElement>
  label: string 
  type: string
  placeholder?: string
}

function Input({ value, onChange, label, type, placeholder }: Props) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700 md-2">{ label }</label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input 
          type={type}
          className="block w-full rounded-md border border-slate-300 p-2 focus:border-slate-500 focus:ring-slate-500" 
          value={value}
          onChange={onChange}
          placeholder={placeholder}/>
      </div>
    </>
  )
}

export default Input