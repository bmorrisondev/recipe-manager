import React from 'react'

type Props = {
  value: any
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  label: string
  rows?: number
  placeholder?: string
}

function TextArea({ value, onChange, label, rows, placeholder }: Props) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mt-2">{ label }</label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <textarea 
          rows={rows} 
          className="block w-full rounded-md border border-slate-300 p-2 focus:border-slate-500 focus:ring-slate-500" 
          value={value}
          onChange={onChange}
          placeholder={placeholder} />
      </div>
    </>
  )
}

export default TextArea