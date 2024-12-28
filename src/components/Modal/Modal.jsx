import { LiaTimesSolid } from "react-icons/lia";

export const Modal = ({ children, isOpen, onClose, modalHeader, className }) => {
   return (
      <div className={`modal ${isOpen ? 'modal-active' : ''}`} onClick={() => { onClose() }}>
         <div className="modal-content"  onClick={(e) => e.stopPropagation()}>
            <h6 className={`h6 ${className ? 'w-full text-left' : 'absolute top-3 left-5' }  `}>{modalHeader}</h6>
            <button className="btn-close" onClick={() => { onClose() }}><LiaTimesSolid size={24} /></button>
            {children}
         </div>
      </div>
   )
}