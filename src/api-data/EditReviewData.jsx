+46
import { IoLocationSharp } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { FaChild } from "react-icons/fa";
import { FaLinkSlash } from "react-icons/fa6";
import { MdOutlineQrCodeScanner } from "react-icons/md";
export const  EditReviewData = [
    {
        menu: "Settings",
        link: "settings",
        icon: <IoMdSettings size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "Appearance",
        link: "appearance",
        icon: <IoIosColorPalette size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "Success-page",
        link: "success-page",
        icon: <FaChild size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "Links",
        link: "links",
        icon: <FaLinkSlash size={20} />,
        visibleTo: ["SUPER_ADMIN", "ORG_ADMIN", "ORG_MEMBER"] // This item is available to all roles
    },
    {
        menu: "Locations",
        link: "location",
        icon: <IoLocationSharp size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    },
    {
        menu: "QrCode",
        link: "qr-code",
        icon: <MdOutlineQrCodeScanner size={20} />,
        visibleTo: ["ORG_ADMIN", "ORG_MEMBER"] // Available to org roles only
    }
];