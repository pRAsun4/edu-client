export const Footer = ( { style , className} ) => {
    return (
        <footer className={` py-2 ${className}`} style={style}>
            <div className="container mx-auto flex justify-center">
                <small>© 2024 EDUSQURE. All Rights Reserved | Powered by Prasun Dev</small>
            </div>
        </footer>
    )
}