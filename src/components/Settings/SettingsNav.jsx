import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaCaretDown } from "react-icons/fa";
import User from '../../api-data/DemoUser'
import { SettingsMenuData } from '../../api-data/SettingsMenuData';

export const SettingsNav = ({ navClass }) => {
    const [isDropdownActive, setIsDropdownActive] = useState(false);
    const [reorderedMenu, setReorderedMenu] = useState(SettingsMenuData); 
    const location = useLocation(); 

    const handleNavClick = () => {
        if (window.matchMedia("(max-width: 1279px)").matches) {
            setIsDropdownActive(prevState => !prevState);
        }
    };
    useEffect(() => {
        let filteredMenu;

        // Filter menu based on user role
        if (User && User.role === "SUPER_ADMIN") {
            // Super Admin only sees Members
            filteredMenu = SettingsMenuData.filter(data => data.menu === "Members");
        } else {
            // For other roles (ORG_ADMIN, ORG_MEMBER), show items based on `visibleTo`
            filteredMenu = SettingsMenuData.filter(data => data.visibleTo?.includes(User?.role));
        }

        if (window.matchMedia("(max-width: 1279px)").matches) {
            // Reorder menu to move active link to the top
            setReorderedMenu([
                ...filteredMenu.filter(data => data.link === location.pathname),
                ...filteredMenu.filter(data => data.link !== location.pathname)
            ]);
        } else {
            // Reset to default order for larger screens
            setReorderedMenu(filteredMenu);
        }
    }, [User]);

    return (
        <aside
            className={`xl:col-span-2 col-span-3 border-r settings__nav z-[99] xl:pt-6 ${isDropdownActive ? 'nav__active' : ''} ${navClass ? navClass : ''}`}
            onClick={handleNavClick}
        >
            <FaCaretDown size={18} className='nav-icon' />
            <ul className='flex flex-col'>
                {reorderedMenu.map((data, index) => (
                    <li key={index} className={`flex items-center justify-center sidebar_li ${location.pathname === data.link ? 'active' : ''} `} >
                        <Link
                            to={data.link}
                            className={`px-5 py-2 ${location.pathname === data.link ? 'active-link-class' : ''}`}
                        >
                            <span className='flex-shrink-0'>{data.icon}</span>
                            {data.menu}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};
