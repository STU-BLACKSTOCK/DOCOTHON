
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Users, 
  FileText, 
  Upload, 
  Settings, 
  X,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: isDoctor ? "/doctor/dashboard" : "/staff/dashboard",
      role: ["doctor", "staff"],
    },
    {
      title: "Patients",
      icon: Users,
      href: "/patients",
      role: ["doctor", "staff"],
    },
    {
      title: "Documents",
      icon: FileText,
      href: "/documents",
      role: ["doctor", "staff"],
    },
    {
      title: "Upload",
      icon: Upload,
      href: "/doctor/upload",
      role: ["doctor"],
    },
    {
      title: "Upload",
      icon: Upload,
      href: "/staff/upload",
      role: ["staff"],
    },
    {
      title: "Reports",
      icon: ClipboardList,
      href: "/reports",
      role: ["doctor"],
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      role: ["doctor", "staff"],
    },
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.role.includes(user.role) : false
  );

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out bg-white border-r pt-16 md:translate-x-0",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        }
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute right-4 top-4 md:hidden"
        aria-label="Close sidebar"
      >
        <X size={20} />
      </Button>

      <div className="overflow-y-auto h-full py-4 px-3">
        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
            >
              <item.icon size={18} />
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
