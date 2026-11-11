"use client";

import React, { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { User, CreateUserRequest, EditUserRequest } from "@/services/usersServices";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@/libs/apiError";
import { Select } from "../inputs/Select";
import { Input } from "../inputs/InputFormCreateWorkout";

interface Props {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEditUserModal({ user, isOpen, onClose }: Props) {
  const { addUser, editUser } = useUsers();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setRole(user.role);
      setPassword("");
    } else {
      setName("");
      setUsername("");
      setRole("");
      setPassword("");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!trimmedName || !trimmedUsername || (!user && !trimmedPassword) || !role) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // Success toasts come from the hook; errors are shown here with the API message.
      if (user) {
        const updatePayload: EditUserRequest = {
          name: trimmedName,
          username: trimmedUsername,
        };
        if (trimmedPassword) updatePayload.password = trimmedPassword;
        await editUser(updatePayload, user.id);
      } else {
        const payload: CreateUserRequest = {
          name: trimmedName,
          username: trimmedUsername,
          password: trimmedPassword,
          role: role as CreateUserRequest["role"],
        };
        await addUser(payload);
      }
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Erro ao salvar usuário."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{user ? "Editar usuário" : "Criar usuário"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!user} hint={user ? "Deixe em branco para manter a senha atual" : undefined} />
          <Select label="Função" value={role} onChange={(e) => setRole(e.target.value)} disabled={!!user} options={[
            { value: "", label: "Selecione uma função" },
            { value: "admin", label: "Administrador" },
            { value: "client", label: "Aluno" },
          ]} required />
          {user && <p className="text-sm text-gray-500 -mt-2">A função não pode ser alterada.</p>}

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700">
              {user ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
