"use client";

import { useEffect, useRef, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import CreateEditUserModal from "@/components/modals/CreateEditUserModal";
import AssignWorkoutSheetModal from "@/components/modals/AssignWorkoutSheetModal";
import { User } from "@/services/usersServices";
import { UserCard } from "@/components/cards/UserCard";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function UserPage() {
  const { users, fetchUsers, loading, removeUser } = useUsers();
  const { user: loggedInUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loggedInUser) {
      fetchUsers();
    }
  }, [loggedInUser, fetchUsers]);

  // Fechar o menu de filtros ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setIsFilterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const applyFilters = () => {
    let filteredUsers = users;

    // Filtro por nome (ignorar caixa alta/baixa)
    if (searchTerm) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por função (admin ou client)
    if (filterRole) {
      filteredUsers = filteredUsers.filter((user) => user.role === filterRole);
    }

    // Ordenar usuários em ordem alfabética
    filteredUsers.sort((a, b) => a.name.localeCompare(b.name));

    return filteredUsers;
  };

  const filteredUsers = applyFilters();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Título com total de usuários e botão de criar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Lista de Usuários <span className="text-gray-500">({filteredUsers.length})</span>
        </h2>
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Criar Usuário
        </button>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={toggleFilterMenu}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaFilter />
        </button>
        <button
          onClick={() => setSearchTerm("")}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaSearch />
        </button>

        {/* Menu de Filtros */}
        {isFilterMenuOpen && (
          <div
            ref={filterMenuRef}
            className="absolute bg-white border rounded shadow-md p-4 z-10"
          >
            <h3 className="font-bold mb-2">Filtrar por Função</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setFilterRole(null)}
                className={`p-2 rounded ${
                  filterRole === null ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterRole("admin")}
                className={`p-2 rounded ${
                  filterRole === "admin"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Administradores
              </button>
              <button
                onClick={() => setFilterRole("client")}
                className={`p-2 rounded ${
                  filterRole === "client"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Alunos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Usuários */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onDelete={confirmDeleteUser}
            onAssignWorkoutSheet={handleAssignWorkoutSheet}
          />
        ))}
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
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => handleDeleteUser(userToDelete?.id || "")}
        message={`Tem certeza de que deseja excluir o usuário ${userToDelete?.name}?`}
        title="Confirmar Exclusão"
      />
    </div>
  );
}