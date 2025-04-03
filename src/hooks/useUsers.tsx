"use client"

import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, useCallback, ReactNode } from 'react';
import { listUsers, createUser, updateUser, deleteUser, CreateUserRequest, setPayment } from '../services/usersServices';
import { User } from '@/services/usersServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UseUsersReturn {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: CreateUserRequest) => Promise<void>;
  editUser: (user: Partial<CreateUserRequest>, id: string) => Promise<void>;
  setPaymentUser: (id: string) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
}

const UsersContext = createContext<UseUsersReturn | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch {
      toast.error('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (user: CreateUserRequest) => {
    try {
      const newUser = await createUser(user);
      setUsers((prev) => [...prev, newUser]);
      toast.success('Usuário criado com sucesso!');
    } catch {
      toast.error('Erro ao criar usuário.');
    }
  }, []);

  const editUser = useCallback(async (user: Partial<CreateUserRequest>, id: string) => {
    try {
      const updatedUser = await updateUser(id, user);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      toast.success('Usuário atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar usuário.');
    }
  }, []);

  const setPaymentUser = useCallback(async (id: string) => {
    try {
      const updatedUser = await setPayment(id);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      toast.success('Usuário atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar usuário.');
    }
  }, []);

  const removeUser = useCallback(async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success('Usuário removido com sucesso!');
    } catch {
      toast.error('Erro ao remover usuário.');
    }
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers, fetchUsers, loading, addUser, editUser, removeUser, setPaymentUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UseUsersReturn => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};