import { IoLocationSharp } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { GrGroup } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { SiMinutemailer } from "react-icons/si";
import { FaPlug } from "react-icons/fa";
import { FaCubesStacked } from "react-icons/fa6";

export const SettingsMenuData = [
    {
        menu: "Settings",
        link: "/settings",
        icon: <IoMdSettings size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "Locations",
        link: "/location",
        icon: <IoLocationSharp size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "Appearance",
        link: "/appearance",
        icon: <IoIosColorPalette size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "Emails",
        link: "/emails",
        icon: <SiMinutemailer size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "Members",
        link: "/members",
        icon: <GrGroup size={20} />,
        visibleTo: ["SUPER_ADMIN", "ORG_ADMIN", "ORG_MEMBER"] // This item is available to all roles
    },
    {
        menu: "Sources",
        link: "/sources",
        icon: <FaCubesStacked size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "Integrations",
        link: "/integrations",
        icon: <FaPlug size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
];
