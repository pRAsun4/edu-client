import { useDispatch, useSelector } from "react-redux";
import { Layout } from "./Layout";
import { clearUser, toggleDarkMode } from "../features/appSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import RightLogo from "../assets/svg/RightLogo";
import PropTypes from "prop-types";
import { useState } from "react";
import { LuPencilLine } from "react-icons/lu";
// import { FaUserTie } from "react-icons/fa";
import { setActiveClass } from "../features/appSlice";
// import { AvatarFunc } from "../utils/Functions";

export const InnerLayout = ({
  children,
  Nav,
  childHeader,
  ChildIcon,
  navClass,
}) => {
  const activeDarkmode = useSelector((state) => state.app.darkModeActivate);
  const [openBox, setOpenBox] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClearUser = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Get token from localStorage
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        "http://localhost:5000/auth/logout",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );

      if (response.ok) {
        // Clear user data from Redux store
        dispatch(clearUser());

        // Remove token and user details from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userDetails");

        // Navigate to the login page
        navigate("/login");
      } else {
        const errorText = await response.text();
        console.error("Logout failed:", errorText);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };
  // const userEmailPart = user?.email?.slice(0, user.email.indexOf("@"));

  const handleModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleProfile = () => {
    setOpenBox(!openBox);
  };

  return (
    <Layout>
      <section className="border-b">
        <div className="flex flex-col relative bg-accent ">
          {childHeader && (
            <div
              className={`p-5 w-full ${
                Nav ? "border-y" : "border-b"
              } inline-flex items-center justify-between h-[100px] gap-5 child-header bg-body absolute lg:fixed right-0 md:top-0 z-[100]`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="w-[2.5rem] h-[2.5rem] flex items-center justify-center icon-div ">
                  {ChildIcon && <ChildIcon size={24} />}
                </span>
                <h3 className="h5">{childHeader}</h3>
              </div>
              <div className="w-auto flex items-center gap-5 relative">
                <button
                  className={`py-4 px-1 min-w-[82px] gap-3 flex-row items-center toggle_btn ${
                    activeDarkmode ? "slide_dark" : ""
                  }`}
                  onClick={handleModeToggle}
                  title="mode toggle"
                >
                  <span className="toggle_icon">
                    {activeDarkmode ? (
                      <FaMoon size={20} />
                    ) : (
                      <FaSun size={20} />
                    )}
                  </span>
                </button>

                <div
                  onClick={handleProfile}
                  className="profile-box w-auto md:min-w-[11.5rem] relative h-[56px] pl-3 pr-8 py-2 flex items-center cursor-pointer rounded-md border"
                >
                  {/* {user?.name ? (
                    <img
                      src={AvatarFunc(user.name)}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <FaUserTie className="w-6 h-6 placeholder_user" />
                  )} */}
                  {/* <div className="pro-titel ml-3 flex flex-col items-start">
                    {user?.name ? (
                      <p className="capitalize p font-medium sm:flex hidden leading-none">
                        {user.name}
                      </p>
                    ) : (
                      <p className="capitalize p leading-none font-medium sm:flex hidden">
                        {userEmailPart || "Guest"}
                      </p>
                    )}
                    <p className="sm:flex hidden text-gray-500 p leading-normal">
                      {user?.role === "ORG_ADMIN"
                        ? "Org admin"
                        : user?.role === "ORG_MEMBER"
                          ? "Org member"
                          : "Super admin"}
                    </p>
                  </div> */}

                  <span className="profile-btn absolute right-2 top-[30%]">
                    <RightLogo />
                  </span>

                  {openBox ? (
                    <div className="profile-drop w-full flex flex-col items-center p-4 gap-4 absolute right-0 top-[60px] z-[999] rounded-md border ">
                      <div className="pro-titel w-full md:flex flex-col items-start hidden"></div>
                      <Link
                        to={`/customers/profile`}
                        className="w-full flex items-center gap-3 "
                        onClick={() => {
                          dispatch(setActiveClass(1));
                        }}
                      >
                        <span
                          className="w-[2.75rem] h-[2.75rem] rounded-lg flex items-center justify-center "
                          style={{ backgroundColor: "var(--btn-hover-color)" }}
                        >
                          {" "}
                          <LuPencilLine size={20} />{" "}
                        </span>
                        <p className=" !text-[14px] font-normal leading-[130%] tracking-[0.28px] ">
                          Edit Profile
                        </p>
                      </Link>
                      <button
                        className="btn w-full  !bg-[#D65D62] text-[#fff]"
                        type="button"
                        onClick={() => {
                          handleClearUser();
                        }}
                        title="Logout"
                      >
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          <div className="xl:grid xl:grid-cols-12 relative !mt-[100px] backgroundBg main_body">
            {Nav && <Nav navClass={navClass} />}
            <div
              className={`${
                Nav ? "col-span-10" : "col-span-12"
              } lg:pt-0 flex flex-col items-center relative bg-second`}
            >
              <div
                className={`${
                  Nav ? "max-xl:pt-[100px] md:pt-10 md:pb-10" : "md:py-10"
                } px-5 flex flex-col items-center h-full justify-start w-full max-w-[1200px] pt-14 pb-5`}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

InnerLayout.propTypes = {
  children: PropTypes.node,
  Nav: PropTypes.elementType,
  childHeader: PropTypes.string,
  ChildIcon: PropTypes.elementType,
  navClass: PropTypes.string,
};
