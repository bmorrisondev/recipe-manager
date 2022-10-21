import React, { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: Function
  title: string
  children: ReactNode
  footer?: JSX.Element
}

function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if(!open) return <></>

  return (
    <div className="relative z-10 w-0">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      {/* Modal */}
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="w-full">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex-1">{ title }</h3>
                    <button onClick={() => onClose()} className="text-gray-700 hover:bg-slate-300 text-grey-darkest font-bold py-1 px-1 rounded-full inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>  
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-900 w-full">
                    { children }
                  </div>
                </div>
              </div>
            </div>
            {footer && (
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
               { footer }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal