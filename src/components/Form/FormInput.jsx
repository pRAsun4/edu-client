export const FormInput = ({children, className}) => {
    return (
       <div className={`form__input ${className}`}>
         {children}
       </div>
    )
}