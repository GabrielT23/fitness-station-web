"use client";

import { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import CreateEditUserModal from "@/components/modals/CreateEditUserModal";
import AssignWorkoutSheetModal from "@/components/modals/AssignWorkoutSheetModal";
import { User } from "@/services/usersServices";

export default function UserPage() {
  const { users, fetchUsers, loading, removeUser } = useUsers();
  const { user: loggedInUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (loggedInUser) {
      fetchUsers();
    }
  }, [loggedInUser, fetchUsers]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    await removeUser(userId);
    setIsConfirmDeleteOpen(false);
  };

  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleAssignWorkoutSheet = (user: User) => {
    setSelectedUser(user);
    setIsAssignModalOpen(true);
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  const admins = users.filter((user) => user.role === "admin");
  const clients = users.filter((user) => user.role === "client");

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuários</h2>
      <button
        onClick={handleCreateUser}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Criar Usuário
      </button>

      {/* Seção de Admins */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Administradores</h3>
        <div className="space-y-4">
          {admins.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded shadow-md w-full flex justify-between items-center flex-wrap"
            >
              <h3 className="text-xl font-bold">{user.name}</h3>
              <div className="mt-4">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmDeleteUser(user)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Clients */}
      <div>
        <h3 className="text-xl font-bold mb-4">Alunos</h3>
        <div className="space-y-4">
          {clients.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded shadow-md w-full flex justify-between items-center flex-wrap"
            >
              <h3 className="text-xl font-bold">{user.name}</h3>
              <div className="mt-4">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmDeleteUser(user)}
                  className="bg-red-500 text-white p-1 rounded mr-2"
                >
                  Excluir
                </button>
                <button
                  onClick={() => handleAssignWorkoutSheet(user)}
                  className="bg-green-500 text-white p-1 rounded"
                >
                  Atribuir Ficha
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criar/Editar Usuário */}
      <CreateEditUserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Modal de Atribuir Ficha */}
      {isAssignModalOpen && selectedUser && (
        <AssignWorkoutSheetModal
          user={selectedUser}
          onClose={() => setIsAssignModalOpen(false)}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isConfirmDeleteOpen && userToDelete && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Confirmar Exclusão</h2>
            <p>
              Tem certeza de que deseja excluir o usuário {userToDelete.name}?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="bg-gray-500 text-white p-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}