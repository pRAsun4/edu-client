// A layout component to center the content
import { Header } from './Header'
import { Footer } from './Footer'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export function Layout({ children }) {
    const activeDarkmode = useSelector(state => state.app.darkModeActivate);

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

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};