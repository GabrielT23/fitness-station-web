"use client"

import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/hooks/useAuth';
import { UsersProvider } from '@/hooks/useUsers';
import { WorkoutSheetsProvider } from '@/hooks/useWorkoutSheets';

interface IAppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: IAppProviderProps) {
  const providers = [
    AuthProvider,
    UsersProvider,
    WorkoutSheetsProvider,
  ];

  return (
    <>
      {providers.reduceRight(
        (child, Provider) => (
          <Provider>{child}</Provider>
        ),
        <>{children}</>,
      )}
      <ToastContainer />
    </>
  );
}