import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  TruckIcon,
  UsersIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Employees', href: '/employees', icon: UsersIcon },
  { name: 'Visitors', href: '/visitors', icon: UserGroupIcon },
  { name: 'Gate Operations', href: '/gates', icon: ArrowsRightLeftIcon, roles: ['BUILDING_ADMIN', 'FACILITY_MANAGER', 'SECURITY_GUARD'] },
  { name: 'Exceptions', href: '/exceptions', icon: ExclamationTriangleIcon, roles: ['BUILDING_ADMIN', 'TENANT_ADMIN', 'FACILITY_MANAGER', 'SECURITY_GUARD'] },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, roles: ['BUILDING_ADMIN', 'TENANT_ADMIN', 'FACILITY_MANAGER'] },
];

const adminNavigation: NavItem[] = [
  { name: 'Parking Locations', href: '/admin/locations', icon: BuildingOfficeIcon, roles: ['BUILDING_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Zones & Spots', href: '/admin/zones', icon: MapPinIcon, roles: ['BUILDING_ADMIN', 'TENANT_ADMIN'] },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, roles: ['BUILDING_ADMIN', 'TENANT_ADMIN'] },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const userRole = user?.role || 'EMPLOYEE';

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const filteredAdminNavigation = adminNavigation.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="ml-3 text-white text-xl font-semibold">ParkPro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </div>

        {filteredAdminNavigation.length > 0 && (
          <>
            <div className="pt-6">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administration
              </p>
            </div>
            <div className="space-y-1 pt-2">
              {filteredAdminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User section */}
      <div className="flex items-center px-4 py-4 border-t border-gray-800">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-400">{user?.role?.replace('_', ' ') || 'Employee'}</p>
        </div>
      </div>
    </div>
  );
}
