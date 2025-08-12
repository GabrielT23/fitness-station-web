"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, message, title = "Confirmar" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
