import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { DashboardNavbar } from './components/DashboardNavbar';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { OrganizationDashboard } from './pages/OrganizationDashboard';
import { EventDetails } from './pages/EventDetails';
import { Profile } from './pages/Profile';
import { Certificates } from './pages/Certificates';
import PostEvent from './pages/PostEvent';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const showDashboardNavbar = !['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {showDashboardNavbar ? <DashboardNavbar /> : <Navigation />}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
              <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
              <Route path="/organization/post-event" element={<PostEvent />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/certificates" element={<Certificates />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;