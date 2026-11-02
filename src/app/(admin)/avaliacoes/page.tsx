"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listUsers, User } from "@/services/usersServices";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function AvaliacoesAdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await listUsers();
        if (!cancelled) setUsers(data.filter((u) => u.role !== "admin"));
      } catch {
        if (!cancelled) toast.error("Erro ao carregar usuários.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Fichas de Avaliação</h1>
          <p className="text-sm text-gray-500 mt-1">
            Selecione um aluno para gerenciar suas avaliações
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar aluno por nome ou usuário..."
            className="w-full px-4 py-3 pl-10 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 animate-pulse">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Nenhum aluno encontrado.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => {
              const isOverdue = user.lastPayment
                ? dayjs().diff(dayjs(user.lastPayment), "day") > 30
                : true;

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        isOverdue ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                      }`}
                    >
                      {isOverdue ? "Não pago" : "Pago"}
                    </span>
                  </div>

                  <button
                    onClick={() => router.push(`/avaliacoes/aluno/${user.id}`)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0H5" />
                    </svg>
                    Avaliações
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
