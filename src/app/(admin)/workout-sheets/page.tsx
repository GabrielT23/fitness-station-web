"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWorkoutSheets } from "@/hooks/useWorkoutSheets";
import { WorkoutSheet } from "@/services/workoutSheetService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WorkoutSheetList() {
  const { sheets, loading, removeSheet } = useWorkoutSheets();
  const [selectedSheet, setSelectedSheet] = useState<WorkoutSheet | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // UI state for responsive filter
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); // desktop dropdown
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false); // mobile sheet
  const filterRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = async (id: string) => {
    const ok = confirm("Tem certeza que deseja excluir esta ficha? Esta ação não pode ser desfeita.");
    if (!ok) return;
    setDeletingId(id);
    try {
      await removeSheet(id);
      toast.success("Ficha excluída com sucesso.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir ficha.");
    } finally {
      setDeletingId(null);
    }
  };



  // fechar ao clicar fora (aplique só uma vez)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // se o menu existe e o clique aconteceu fora dele, fecha ambos
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
        // se estiver aberto o sheet mobile, também fecha (evita estados inconsistentes)
        setIsFilterSheetOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewUsers = (sheet: WorkoutSheet) => {
    setSelectedSheet(sheet);
    setIsUserModalOpen(true);
  };

  const filtered = useMemo(() => {
    let list = sheets;
    if (filter === "active") list = list.filter((s) => s.isActive);
    if (filter === "inactive") list = list.filter((s) => !s.isActive);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [sheets, filter, query]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-600">Carregando fichas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-25 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Fichas de Treino</h2>
            <p className="text-sm text-gray-500 mt-1">Gerencie, visualize e vincule suas fichas de treino</p>
          </div>

          <div className="flex w-full sm:w-auto gap-3 items-center">
            {/* Search - full width on small screens */}
            <div className="relative flex-1 sm:flex-none">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou tipo..."
                className="w-full sm:w-64 md:w-80 px-4 py-2 rounded-full border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                aria-label="Buscar fichas"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Desktop filter dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setIsFilterMenuOpen((s) => !s); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md"
                aria-haspopup="true"
                aria-expanded={isFilterMenuOpen}
              >
                <span className="text-sm">Filtrar</span>
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M10 20h4" />
                </svg>
              </button>

              {isFilterMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg p-3 z-50"
                  role="menu"
                >
                  <p className="text-sm font-medium mb-2">Filtrar</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { setFilter("all"); setIsFilterMenuOpen(false); }}
                      className={`text-left px-3 py-2 rounded ${filter === "all" ? "bg-pink-600 text-white" : "hover:bg-gray-100"}`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => { setFilter("active"); setIsFilterMenuOpen(false); }}
                      className={`text-left px-3 py-2 rounded ${filter === "active" ? "bg-pink-600 text-white" : "hover:bg-gray-100"}`}
                    >
                      Ativas
                    </button>
                    <button
                      onClick={() => { setFilter("inactive"); setIsFilterMenuOpen(false); }}
                      className={`text-left px-3 py-2 rounded ${filter === "inactive" ? "bg-pink-600 text-white" : "hover:bg-gray-100"}`}
                    >
                      Inativas
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile filter bottom sheet (render separado; garante z-index alto) */}
            {isFilterSheetOpen && (
              <div className="fixed inset-0 z-50 flex items-end">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-white rounded-t-2xl p-4 shadow-lg z-50"
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Filtrar</h3>
                    <button onClick={() => setIsFilterSheetOpen(false)} className="text-gray-500">Fechar</button>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => { setFilter("all"); setIsFilterSheetOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded ${filter === "all" ? "bg-pink-600 text-white" : "bg-gray-100"}`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => { setFilter("active"); setIsFilterSheetOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded ${filter === "active" ? "bg-pink-600 text-white" : "bg-gray-100"}`}
                    >
                      Ativas
                    </button>
                    <button
                      onClick={() => { setFilter("inactive"); setIsFilterSheetOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded ${filter === "inactive" ? "bg-pink-600 text-white" : "bg-gray-100"}`}
                    >
                      Inativas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Nenhuma ficha encontrada.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((sheet) => (
              <article
                key={sheet.id}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between"
                aria-labelledby={`sheet-${sheet.id}`}
              >
                <div>
                  <h3 id={`sheet-${sheet.id}`} className="text-lg font-semibold text-pink-600 mb-1">
                    {sheet.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">Tipo: <span className="font-medium text-gray-800">{sheet.type}</span></p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className={`font-semibold ${sheet.isActive ? "text-green-600" : "text-red-600"}`}>
                      {sheet.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleViewUsers(sheet)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white transition"
                    aria-label={`Ver usuários da ficha ${sheet.name}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87" />
                    </svg>
                    Ver Usuários
                  </button>

                  <button
                    onClick={() => handleDelete(sheet.id)}
                    disabled={deletingId === sheet.id}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                    aria-disabled={deletingId === sheet.id}
                  >
                    {deletingId === sheet.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal: users (responsive) */}
        {isUserModalOpen && selectedSheet && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="users-modal-title"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsUserModalOpen(false)}
            />

            {/* Modal box */}
            <div className="relative w-full max-w-3xl mx-4 md:mx-0 bg-white rounded-2xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
                <h3 id="users-modal-title" className="text-lg font-semibold text-gray-800">
                  Usuários vinculados — {selectedSheet.name}
                </h3>
                <button onClick={() => setIsUserModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              {/* Scrollable content */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {selectedSheet.WorkoutSheetUsers.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedSheet.WorkoutSheetUsers.map((w) => (
                      <li key={w.user.id} className="flex items-center justify-between bg-pink-50 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-gray-800">{w.user.name}</p>
                          <p className="text-sm text-gray-500">{w.user.username} • {w.user.role}</p>
                        </div>
                        <div className="text-sm text-gray-600">{new Date(w.createdAt).toLocaleDateString()}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Nenhum usuário vinculado a esta ficha.</p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}


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
                  onClick={() => { setFilter("all"); setIsFilterSheetOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded ${filter === "all" ? "bg-pink-600 text-white" : "bg-gray-100"}`}
                >
                  Todas
                </button>
                <button
                  onClick={() => { setFilter("active"); setIsFilterSheetOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded ${filter === "active" ? "bg-pink-600 text-white" : "bg-gray-100"}`}
                >
                  Ativas
                </button>
                <button
                  onClick={() => { setFilter("inactive"); setIsFilterSheetOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded ${filter === "inactive" ? "bg-pink-600 text-white" : "bg-gray-100"}`}
                >
                  Inativas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

