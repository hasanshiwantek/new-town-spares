// import { Home, ShoppingCart, Users, Store, LineChart, Gift, Settings, AppWindow, Layers, Banknote, Megaphone } from "lucide-react";
import {
  Home,
  MessageSquareText,
  IdCard, // or SquareUser
  Users,
  User,
  BarChart3,
  Settings,
} from "lucide-react";
export const sidebarData = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    //  children: [],
  },
  {
    title: "Administrative Functions",
    icon: MessageSquareText,
    children: [
      { title: "Edit Wellers", url: "/administrative/edit-wellers" },
      {
        title: "Add/Edit Administrator",
        url: "/administrative/add-edit-administrator",
      },
      { title: "Edit PG Location", url: "/administrative/edit-pg-location" },
      { title: "Session Overview", url: "/administrative/session-overview" },
      {
        title: "Add New Weller Manually",
        url: "/administrative/add-new-weller",
      },
      { title: "View Teachers /PGLs", url: "/administrative/view-leaders" },
      {
        title: "Add/Edit Current Groups",
        url: "/administrative/add-edit-currentgroups",
      },
    ],
  },
  {
    title: "Info for Leaders",
    icon: IdCard,
    children: [
      // { title: "Volunteer Info", url: "/info-leaders/volunteer-info" },
      { title: "Weller Quick View", url: "/info-leaders/quick-view" },
      { title: "Current Groups", url: "/info-leaders/current-groups" },
       { title: "Teacher Roster", url: "/info-leaders/teacher-roster" },
      { title: "Change Password", url: "/update-password" },
    ],
  },
  {
    title: "Prayers groups",
    icon: Users,
    children: [],
  },
  {
    title: "View Wellers by day",
    icon: User,
    children: [
      { title: "View Wellers", url: "/wellers" },
      { title: "Screen name", url: "/wellers/screen-name" },
      // { title: "Wam Backup", url: "/wellers/wam-backup" },
      // { title: "Studies", url: "/wellers/studies" },
      // { title: "New Wellers", url: "/wellers/new-wellers" },
    ],
  },
  { title: "Weekly Reports", icon: BarChart3, url: "/weekly-reports" },
  { title: "Account Settings", url: "/update-password", icon: Settings },
];
