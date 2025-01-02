import { MdDashboardCustomize, MdReviews } from "react-icons/md";
import { FaCog, FaStar } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";
import { BsFillPeopleFill } from "react-icons/bs";

// SidebarData Array with Roles
export const SidebarData = [
   {
      menu: "Dashboard",
      link: "/",
      icon: <MdDashboardCustomize size={20} />,
      title: "Dashboard",
      roles: ["SUPER_ADMIN", "ORG_ADMIN", "ORG_MEMBER"], // Accessible by all roles
   },
   {
      menu: "Organization",
      link: "/organizations",
      icon: <GoOrganization size={20} />,
      title: "Organization",
      roles: ["ORG_ADMIN", "ORG_MEMBER"],
   },
   {
      menu: "Team Member",
      link: "/members",
      icon: <BsFillPeopleFill size={20} />,
      title: "Team Member",
      roles: ["ORG_ADMIN", "ORG_MEMBER"],
   },
   {
      menu: "Reviews",
      link: "/reviews",
      icon: <MdReviews size={20} />,
      title: "Reviews",
      roles: ["SUPER_ADMIN", "ORG_ADMIN", "ORG_MEMBER"], // Accessible by all roles
   },
   {
      menu: "Settings",
      link: "/settings",
      icon: <FaCog size={20} />,
      title: "Settings",
      roles: ["ORG_ADMIN", "ORG_MEMBER"], // Accessible by SUPER_ADMIN and ORG_ADMIN
   },
   {
      menu: "Review Pages",
      link: "/review-pages",
      icon: <FaStar size={20} />,
      title: "Review Pages",
      roles: ["SUPER_ADMIN", "ORG_ADMIN", "ORG_MEMBER"], // Accessible by SUPER_ADMIN and ORG_ADMIN
   },
];
