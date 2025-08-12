"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import CreateEditUserModal from "@/components/modals/CreateEditUserModal";
import AssignWorkoutSheetModal from "@/components/modals/AssignWorkoutSheetModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { UserCard } from "@/components/cards/UserCard";
import { toast } from "react-toastify";
import { User } from "@/services/usersServices";

/**
 * Responsive UserPage
 * - Busca full-width em mobile
 * - Filter dropdown em desktop / bottom-sheet em mobile
 * - Grid responsivo (1 / 2 / 3 / 4 colunas conforme largura)
 * - FAB (botão flutuante) para criar usuário em telas pequenas
 */

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
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false); // mobile sheet
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loggedInUser) fetchUsers();
  }, [loggedInUser, fetchUsers]);

  // close filter menu when clicking outside (desktop dropdown)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (u: User) => {
    setSelectedUser(u);
    setIsModalOpen(true);
  };

  const handleAssignWorkoutSheet = (u: User) => {
    setSelectedUser(u);
    setIsAssignModalOpen(true);
  };

  const confirmDeleteUser = (u: User) => {
    setUserToDelete(u);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteUser = async (userId?: string) => {
    if (!userId) return;
    try {
      await removeUser(userId);
      toast.success("Usuário removido");
      setIsConfirmDeleteOpen(false);
    } catch {
      toast.error("Erro ao remover usuário");
    }
  };

  const applyFilters = () => {
    let list = users.slice();
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
    }
    if (filterRole) list = list.filter((u) => u.role === filterRole);
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  };

  const filteredUsers = applyFilters();

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-pink-50 to-pink-25">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Usuários</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie usuários, funções e vinculação de fichas.</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-full md:w-auto">
            {/* Search (full width on small screens) */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="search"
                  aria-label="Pesquisar usuários"
                  placeholder="Pesquisar por nome ou usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 md:w-96 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
                <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>

              {/* Filter control - desktop dropdown */}
              <div className="relative" ref={filterMenuRef}>
                <button
                  onClick={() => setIsFilterMenuOpen((s) => !s)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md"
                  aria-haspopup="true"
                  aria-expanded={isFilterMenuOpen}
                >
                  <FaFilter />
                  <span className="hidden md:inline text-sm">Filtrar</span>
                </button>

                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3 z-20">
                    <p className="text-sm font-medium mb-2">Filtrar por função</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => { setFilterRole(null); setIsFilterMenuOpen(false); }}
                        className={`text-left px-3 py-2 rounded ${filterRole === null ? "bg-pink-600 text-white" : "hover:bg-gray-100"}`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => { setFilterRole("admin"); setIsFilterMenuOpen(false); }}
                        className={`text-left px-3 py-2 rounded ${filterRole === "admin" ? "bg-pink-600 text-white" : "hover:bg-gray-100"}`}
                      >
                        Administradores
                      </button>
                      <button
                        onClick={() => { setFilterRole("client"); setIsFilterMenuOpen(false); }}
                        className={`text-left px-3 py-2 rounded ${filterRole === "client" ? "bg-pink-600 text-white" : "hover:bg-gray-100"}`}
                      >
                        Alunos
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Create button (hidden small screens show FAB instead) */}
              <button
                onClick={handleCreateUser}
                className="hidden sm:inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full shadow"
              >
                <FaPlus /> Criar Usuário
              </button>
            </div>
          </div>
        </div>

        {/* Grid of users - responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-600">Carregando...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-600">Nenhum usuário encontrado.</div>
          ) : (
            filteredUsers.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                onEdit={() => handleEditUser(u)}
                onAssignWorkoutSheet={() => handleAssignWorkoutSheet(u)}
                onDelete={() => confirmDeleteUser(u)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating action button for mobile create */}
      <button
        onClick={handleCreateUser}
        className="fixed bottom-6 right-6 sm:hidden z-40 inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-600 text-white shadow-xl"
        aria-label="Criar usuário"
      >
        <FaPlus />
      </button>

      {/* Mobile filter bottom sheet */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsFilterSheetOpen(false)} />
          <div className="w-full bg-white rounded-t-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Filtrar</h3>
              <button onClick={() => setIsFilterSheetOpen(false)} className="text-gray-500">Fechar</button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => { setFilterRole(null); setIsFilterSheetOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded ${filterRole === null ? "bg-pink-600 text-white" : "bg-gray-100"}`}
              >
                Todos
              </button>
              <button
                onClick={() => { setFilterRole("admin"); setIsFilterSheetOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded ${filterRole === "admin" ? "bg-pink-600 text-white" : "bg-gray-100"}`}
              >
                Administradores
              </button>
              <button
                onClick={() => { setFilterRole("client"); setIsFilterSheetOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded ${filterRole === "client" ? "bg-pink-600 text-white" : "bg-gray-100"}`}
              >
                Alunos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateEditUserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {isAssignModalOpen && selectedUser && (
        <AssignWorkoutSheetModal
          user={selectedUser}
          onClose={() => setIsAssignModalOpen(false)}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => handleDeleteUser(userToDelete?.id)}
        title="Confirmar exclusão"
        message={`Deseja realmente excluir o usuário ${userToDelete?.name}? Esta ação é irreversível.`}
      />
    </div>
  );
}


