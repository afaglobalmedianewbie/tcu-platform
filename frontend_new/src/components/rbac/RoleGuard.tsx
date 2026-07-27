'use client';
import React, { useEffect, useState } from 'react';

interface RoleGuardProps {
  allowedRoles: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  fallback = null,
  children
}: RoleGuardProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('tcu_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserRole(user.role);
        } catch (e) {
          console.error('Error parsing user object from localStorage:', e);
        }
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex space-x-2 justify-center items-center h-48">
        <div className="h-2 w-2 bg-[#7B4DFF] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-[#7B4DFF] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-[#7B4DFF] rounded-full animate-bounce"></div>
      </div>
    );
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
