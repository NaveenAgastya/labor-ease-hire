
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Home, Clock, CheckCircle, Search, CreditCard, User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink = ({ to, icon, label, active }: SidebarLinkProps) => (
  <Link to={to} className="w-full">
    <div
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-100 transition-colors",
        active && "bg-blue-50 text-primary"
      )}
    >
      <div className="text-lg">{icon}</div>
      <span>{label}</span>
    </div>
  </Link>
);

const ClientSidebar = () => {
  const location = useLocation();
  const { currentUser, logOut } = useAuth();
  const pathName = location.pathname;

  return (
    <div className="min-h-screen w-64 border-r bg-white p-4 flex flex-col">
      <div className="flex items-center justify-center mb-8 pt-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>{currentUser?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-grow">
        <SidebarLink
          to="/client-dashboard"
          icon={<Home />}
          label="Dashboard"
          active={pathName === '/client-dashboard'}
        />
        
        <SidebarLink
          to="/client-dashboard/find-laborers"
          icon={<Search />}
          label="Find Laborers"
          active={pathName === '/client-dashboard/find-laborers'}
        />
        
        <SidebarLink
          to="/client-dashboard/ongoing"
          icon={<Clock />}
          label="Ongoing Jobs"
          active={pathName === '/client-dashboard/ongoing'}
        />
        
        <SidebarLink
          to="/client-dashboard/completed"
          icon={<CheckCircle />}
          label="Completed Jobs"
          active={pathName === '/client-dashboard/completed'}
        />
        
        <SidebarLink
          to="/client-dashboard/payments"
          icon={<CreditCard />}
          label="Payments"
          active={pathName === '/client-dashboard/payments'}
        />
        
        <SidebarLink
          to="/client-dashboard/profile"
          icon={<User />}
          label="Profile"
          active={pathName === '/client-dashboard/profile'}
        />
        
        <SidebarLink
          to="/client-dashboard/settings"
          icon={<Settings />}
          label="Settings"
          active={pathName === '/client-dashboard/settings'}
        />
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <button 
          onClick={logOut}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-colors"
        >
          <div className="text-lg"><LogOut /></div>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ClientSidebar;
