import { useDispatch, useSelector } from "react-redux";
import {
  setActiveClass,
  toggleDarkMode,
  toggleSidebar,
} from "../features/appSlice";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { SidebarData } from "../api-data/Sidebar";
import ReviewLogo from "../assets/svg/ReviewLogo";
import LogoText from "../assets/svg/LogoText";

export const Header = ({ className }) => {
  // const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const dispatch = useDispatch();

  const activeDarkmode = useSelector((state) => state.app.darkModeActivate);
  const activeSidebar = useSelector((state) => state.app.sidebarVisible);
  const activeIndex = useSelector((state) => state.app.activeClass);

  // const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth > 980);

  // Handle resize event
  // const handleResize = () => {
  //   // Update the state when screen size is greater than 980px
  //   if (window.innerWidth > 980) {
  //     setIsScreenLarge(true);
  //   } else {
  //     setIsScreenLarge(false);
  //   }
  // };

  // Use effect to add resize event listener when the component mounts
  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);

  //   // Cleanup the event listener when component unmounts
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 980) {
        dispatch(toggleSidebar(false));
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  const [isHamburgerActive, setIsHamburgerActive] = useState(false);

  //   const filteredSidebarData = SidebarData.filter((data) =>
  //     data.roles.includes(user?.role)
  //  );

  // useEffect(() => {

  //   if (user && user.role === "ORG_ADMIN") {
  //     setIsOrgAdmin(true);
  //   }
  // }, [user]);

  // const handleClearUser = () => {
  //   dispatch(clearUser());
  // };

  const handleHamburger = () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setIsHamburgerActive((prevState) => !prevState);
    }
  };

  const handleModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const toggleCollaps = () => {
    dispatch(toggleSidebar());
  };
  const handleActiveClass = (index) => {
    dispatch(setActiveClass(index));
  };

  return (
    <header
      className={`header ${className} ${
        activeSidebar ? "sidebar-active" : "header__collapse"
      } ${isHamburgerActive ? "hamburger__active" : ""}`}
    >
      <div className="flex flex-col justify-between gap-5 h-screen header__inner">
        <div>
          <Link
            to={`/`}
            className={` link-btn main-logo flex ${
              activeSidebar
                ? "items-center justify-start p-5"
                : "items-center justify-center pl-3"
            }`}
          >
            <ReviewLogo className=" w-[30px] h-[30px] " />
            {activeSidebar ? <LogoText className=" w-fit h-[30px] " /> : null}
          </Link>
          <nav className="nav-header">
            <ul
              className={` ${
                activeSidebar
                  ? "justify-start items-center"
                  : "items-center justify-center"
              } flex`}
            >
              {SidebarData.map((data, index) => {
                // Conditionally skip rendering "Review Pages" if isOrgAdmin is false
                // if (data.menu === "Review Pages" && !isOrgAdmin) return null;

                return (
                  <li
                    key={index}
                    className={`${activeIndex === index ? "active" : ""} sidebar-item w-full`}
                    title={data.title}
                    onClick={() => handleActiveClass(index)}
                  >
                    <Link
                      to={data.link}
                      className={` link-btn py-2 px-6 ${activeIndex === index ? "active" : ""} sidebar-item w-full`}
                    >
                      {data.icon}
                      {activeSidebar ? (
                        <span className="sidebar-text">{data.menu}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div
          className={`flex flex-col xl:flex-column gap-4 py-5 nav-footer ${
            activeSidebar ? " " : "justify-center items-start"
          } `}
        >
          <button
            className="py-4 px-6 gap-2
            flex flex-row items-center !min-w-0 collapse-btn"
            onClick={toggleCollaps}
            title="Collapse Menu"
          >
            <MdKeyboardDoubleArrowLeft
              className={!activeSidebar ? "rotate-180" : "rotate-0"}
              size={28}
            />
            {activeSidebar && <span>Collapse</span>}
          </button>
          <button
            className={`py-4 px-1 min-w-[82px] gap-3 flex flex-row items-center toggle_btn ${activeDarkmode ? "slide_dark" : ""}`}
            onClick={handleModeToggle}
            title="mode toggle"
          >
            <span className="toggle_icon">
              {activeDarkmode ? <FaMoon size={20} /> : <FaSun size={20} />}
            </span>
            {/* <span>{activeDarkmode ? "light" : "dark"}</span> */}
          </button>
        </div>

        <button
          className="btn btn-outline hamburger-btn"
          onClick={handleHamburger}
        >
          <IoMdMenu size={30} />
        </button>
      </div>
    </header>
  );
};
