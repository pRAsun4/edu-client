import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaCaretDown } from "react-icons/fa";
import { useAuth } from 'wasp/client/auth';
import { EditReviewData } from '../../api-data/EditReviewData';

export const EditNav = ({ navClass }) => {
    const { data: user } = useAuth();
    const [isDropdownActive, setIsDropdownActive] = useState(false);
    const [reorderedMenu, setReorderedMenu] = useState(EditReviewData); // Default menu
    const location = useLocation(); // Get the current location
    const page = useParams();
    const handleNavClick = () => {
        if (window.matchMedia("(max-width: 1279px)").matches) {
            setIsDropdownActive(prevState => !prevState);
        }
    };
    const pathSegments = location.pathname.split('/');
    const dynamicSegment = pathSegments[2]; 
    // console.log(dynamicSegment , "path");

    useEffect(() => {
        let filteredMenu;

        // Filter menu based on user role
        if (user && user.role === "SUPER_ADMIN") {
            // Super Admin only sees Members
            filteredMenu = EditReviewData.filter(data => data.menu === "Members");
        } else {
            // For other roles (ORG_ADMIN, ORG_MEMBER), show items based on `visibleTo`
            filteredMenu = EditReviewData.filter(data => data.visibleTo?.includes(user?.role));
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
    }, [location.pathname, user]);

    return (
        <aside
            className={`xl:col-span-2 col-span-3 border-r xl:min-h-screen settings__nav z-[99] ${isDropdownActive ? 'nav__active' : ''} ${navClass ? navClass : ''}`}
            onClick={handleNavClick}
        >
            <FaCaretDown size={18} className='nav-icon' />
            <ul className='flex flex-col'>
                {reorderedMenu.map((data, index) => (
                    <li key={index} className={`flex items-center justify-center sidebar_li  ${dynamicSegment === data.link ? 'active' : ''} `} >
                        <Link
                            to={`/review-pages/${data.link}/${page.id}`}
                            className={`px-5 py-2 ${dynamicSegment === data.link ? 'active-link-class' : ''} `}
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
