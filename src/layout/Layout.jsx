// A layout component to center the content
import { Header } from './Header'
import { Footer } from './Footer'
import { useSelector } from 'react-redux';

export function Layout({ children }) {
    const activeDarkmode = useSelector(state => state.user.darkModeActivate);

    return (
        <>
            <Header className={`${activeDarkmode ? 'dark' : 'light'}`} />
            <main id="main" className={`${activeDarkmode ? 'dark' : 'light'}`}>
                {children}
            </main>
            <Footer className={`${activeDarkmode ? 'dark' : 'light'}`} />
        </>
    )
}