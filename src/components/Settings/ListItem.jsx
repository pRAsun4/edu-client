export const ListItem = ({children, className}) => {
    return (
        <li className={`list__item ${className} `}>
            {children}
        </li>
    )
}