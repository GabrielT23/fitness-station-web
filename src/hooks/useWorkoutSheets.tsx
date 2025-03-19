"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  listWorkoutSheets, 
  createWorkoutSheet, 
  updateWorkoutSheet, 
  deleteWorkoutSheet, 
  WorkoutSheet, 
  CreateWorkoutSheetRequest, 
  linkSheetToUser, 
  unLinkSheetToUser
} from '../services/workoutSheetService';

interface UseWorkoutSheetsReturn {
  sheets: WorkoutSheet[];
  loading: boolean;
  error: string | null;
  addSheet: (newSheet: CreateWorkoutSheetRequest) => Promise<void>;
  editSheet: (updatedSheet: WorkoutSheet, id: string) => Promise<void>;
  removeSheet: (id: string) => Promise<void>;
  linkSheet: (userId: string, workoutSheetId: string) => Promise<void>;
  unLinkSheet: (userId: string, workoutSheetId: string) => Promise<void>;
}

const WorkoutSheetsContext = createContext<UseWorkoutSheetsReturn | undefined>(undefined);

export const WorkoutSheetsProvider = ({ children }: { children: ReactNode }) => {
  const [sheets, setSheets] = useState<WorkoutSheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);
        const data = await listWorkoutSheets();
        setSheets(data);
      } catch {
        toast.error('Erro ao buscar fichas de treino.');
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  const addSheet = async (newSheet: CreateWorkoutSheetRequest) => {
    try {
      const createdSheet = await createWorkoutSheet(newSheet);
      setSheets((prevSheets) => [...prevSheets, createdSheet]);
      toast.success('Ficha de treino criada com sucesso!');
    } catch {
      toast.error('Erro ao criar ficha de treino.');
    }
  };

  const editSheet = async (updatedSheet: WorkoutSheet, id: string) => {
    try {
      const response = await updateWorkoutSheet(id, updatedSheet);
      setSheets((prevSheets) =>
        prevSheets.map((sheet) => (sheet.id === response.id ? response : sheet))
      );
      toast.success('Ficha de treino atualizada com sucesso!');
    } catch {
      toast.error('Erro ao atualizar ficha de treino.');
    }
  };

  const linkSheet = async (userId: string, workoutSheetId: string) => {
    try {
      await linkSheetToUser({ userId, workoutSheetId });
      toast.success('Ficha de treino vinculada ao usuário com sucesso!');
    } catch {
      toast.error('Erro ao vincular ficha de treino ao usuário.');
    }
  };

  const unLinkSheet = async (userId: string, workoutSheetId: string) => {
    try {
      await unLinkSheetToUser({ userId, workoutSheetId });
      toast.success('Ficha de treino vinculada ao usuário com sucesso!');
    } catch {
      toast.error('Erro ao vincular ficha de treino ao usuário.');
    }
  };

  const removeSheet = async (id: string) => {
    try {
      await deleteWorkoutSheet(id);
      setSheets((prevSheets) => prevSheets.filter((sheet) => sheet.id !== id));
      toast.success('Ficha de treino removida com sucesso!');
    } catch {
      toast.error('Erro ao remover ficha de treino.');
    }
  };

  return (
    <WorkoutSheetsContext.Provider value={{ sheets, loading, error: null, addSheet, editSheet, removeSheet, linkSheet, unLinkSheet }}>
      {children}
    </WorkoutSheetsContext.Provider>
  );
};

export const useWorkoutSheets = (): UseWorkoutSheetsReturn => {
  const context = useContext(WorkoutSheetsContext);
  if (context === undefined) {
    throw new Error("useWorkoutSheets must be used within a WorkoutSheetsProvider");
  }
  return context;
};