import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import HiringGroupDashboard from '@/components/dashboards/HiringGroupDashboard';
import CompanyDashboard from '@/components/dashboards/CompanyDashboard';
import CandidateDashboard from '@/components/dashboards/CandidateDashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role.toLowerCase()) {
      case UserRole.ADMIN:
        return <AdminDashboard />;
      case UserRole.HIRING_GROUP:
        return <HiringGroupDashboard />;
      case UserRole.COMPANY:
        return <CompanyDashboard />;
      case UserRole.POSTULANTE:
        return <CandidateDashboard />;
      case UserRole.EMPLOYEE:
        return <EmployeeDashboard />;
      default:
        return <div>Rol de usuario no válido</div>;
    }
  };

  return renderDashboard();
};

export default DashboardPage;