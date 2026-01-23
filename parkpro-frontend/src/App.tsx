import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { useAuthStore } from './store';
import {
  Login,
  Dashboard,
  Bookings,
  Vehicles,
  Employees,
  Visitors,
  Gates,
  Exceptions,
  Reports,
} from './pages';
import { Locations, Zones, Settings } from './pages/admin';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirects to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/gates" element={<Gates />} />
          <Route path="/exceptions" element={<Exceptions />} />
          <Route path="/reports" element={<Reports />} />

          {/* Admin Routes */}
          <Route path="/admin/locations" element={<Locations />} />
          <Route path="/admin/zones" element={<Zones />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
