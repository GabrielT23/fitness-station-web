import { useState, useEffect } from 'react';


import { createWorkoutSheet, updateWorkoutSheet, WorkoutSheet } from '@/services/workoutSheetService';
import { useAuth } from '@/hooks/useAuth';

interface CreateEditWorkoutSheetModalProps {
  workoutSheet?: WorkoutSheet;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEditWorkoutSheetModal({ workoutSheet, onClose, onSuccess }: CreateEditWorkoutSheetModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const {user: userLogged} = useAuth();

  useEffect(() => {
    if (workoutSheet) {
      setName(workoutSheet.name);
    }
  }, [workoutSheet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workoutSheet) {
      await updateWorkoutSheet(workoutSheet.id, { ...workoutSheet, name });
    } else {
      await createWorkoutSheet({ type: 'workoutSheet', name, isActive: true, companyId: userLogged?.companyId ? userLogged?.companyId: ''});
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">{workoutSheet ? 'Editar Ficha de Treino' : 'Criar Ficha de Treino'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">Salvar</button>
          <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
        </form>
      </div>
    </div>
  );
}