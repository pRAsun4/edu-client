const Card = ({children,cardTitle}) => {
  return (
    <div className="w-full flex flex-col border rounded-md card-bg">
        {cardTitle && (
            <div className="upper-settings-body w-full h-auto flex justify-between items-center p-4 border-b">
            <h4 className="font-bold">{cardTitle}</h4>
         </div>
        )}
        <div className="relative p-5">
        {children}
        </div>
        </div>
  )
}

export default Card;