import { useState, useEffect, useRef } from "react";
import { User } from "@/services/usersServices";
import { FaEllipsisV } from "react-icons/fa";
import { useUsers } from "@/hooks/useUsers";
import dayjs from "dayjs";
import { ConfirmDialog } from "../modals/ConfirmDialog";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAssignWorkoutSheet?: (user: User) => void; // Apenas para clientes
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onAssignWorkoutSheet,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmPayment, setIsConfirmPayment] = useState(false);
  const { setPaymentUser } = useUsers();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isPaymentOverdue = user.lastPayment
    ? dayjs().diff(dayjs(user.lastPayment), "day") > 30
    : true;

  // Fechar o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md w-full flex items-center relative">
      {/* Flag de Administrador */}
      {user.role === "admin" && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold px-0 py-0 rounded-bl">
          Administrador
        </div>
      )}

      {/* Texto do nome do usuário */}
      <div className="flex-grow flex-wrap">
        <h3 className="text-xl font-bold break-words">{user.name}</h3>
        {user.role !== "admin" && (
          <>
            <p
              className={`text-sm font-semibold ${
                isPaymentOverdue ? "text-red-500" : "text-green-500"
              }`}
            >
              {isPaymentOverdue ? "Não Pago" : "Pago"}
            </p>
            <p className="text-xs text-gray-500">
              {user.lastPayment
                ? `Último pagamento: ${dayjs(user.lastPayment).format("DD/MM/YYYY")}`
                : "Sem registro de pagamento"}
            </p>
          </>
        )}
      </div>

      {/* Botão de 3 pontinhos */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
        >
          <FaEllipsisV className="text-gray-600" />
        </button>

        {/* Menu suspenso */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
            <ul className="py-1">
              <li>
                <button
                  onClick={() => {
                    onEdit(user);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Editar
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onDelete(user);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Excluir
                </button>
              </li>
              {onAssignWorkoutSheet && (
                <li>
                  <button
                    onClick={() => {
                      onAssignWorkoutSheet(user);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Atribuir Ficha
                  </button>
                </li>
              )}
              {user.role !== "admin" && (
                <li>
                  <button
                    onClick={() => setIsConfirmPayment(true)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Atualizar Pagamento
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Diálogo de Confirmação de Pagamento */}
      {user.role !== "admin" && (
        <ConfirmDialog
          isOpen={isConfirmPayment}
          onClose={() => setIsConfirmPayment(false)}
          onConfirm={() => {
            setPaymentUser(user.id);
            setIsConfirmPayment(false);
          }}
          message={`Tem certeza de que deseja atualizar o pagamento do usuário ${user.name}?`}
          title="Atualizar Pagamento"
        />
      )}
    </div>
  );
};