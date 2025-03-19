import { useWorkoutSheets } from '@/hooks/useWorkoutSheets';
import { listWorkoutSheets, WorkoutSheet } from '@/services/workoutSheetService';
import { useState, useEffect, useCallback } from 'react';


interface AssignWorkoutSheetModalProps {
  user: { id: string; role: string };
  onClose: () => void;
}

export default function AssignWorkoutSheetModal({ user, onClose }: AssignWorkoutSheetModalProps) {
  const [selectedSheetId, setSelectedSheetId] = useState<string>('');
  
  const { sheets, linkSheet } = useWorkoutSheets();

  const handleAssign = useCallback( async () => {
    console.log(selectedSheetId)
    await linkSheet(user.id, selectedSheetId);
    
    onClose();
  },[selectedSheetId, user.id, linkSheet]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Atribuir Ficha de Treino</h2>
        <select
          value={selectedSheetId}
          onChange={(e) => setSelectedSheetId(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option value="">Selecione uma ficha</option>
          {sheets.map(sheet => (
            <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
          ))}
        </select>
        <button onClick={handleAssign} className="bg-blue-500 text-white p-2 rounded mr-2">Atribuir</button>
        <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
      </div>
    </div>
  );
}