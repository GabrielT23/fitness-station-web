"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../assets/logo.png';
import { login } from '../../../services/authService';
import { setSession } from '../../../libs/session';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

function loginErrorMessage(error: unknown): string {
  const status = (error as AxiosError).response?.status;
  if (status === 401) return 'Usuário ou senha incorretos';
  if (status === 429) return 'Muitas tentativas. Tente novamente em instantes.';
  if (!(error as AxiosError).response) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
  }
  return 'Não foi possível entrar. Tente novamente.';
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const u = username.trim(), p = password.trim();
    setUsername(u);
    if (!u || !p) {
      toast.error('Preencha todos os campos');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await login({ username: u, password: p });
      setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        role: data.role,
        userId: data.userId,
        companyId: data.companyId,
      });
      router.push(data.role === 'client' ? '/dashboard' : '/');
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-pink-300">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Logo Academia" width={120} height={120} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Bem-vindo de volta!
        </h2>
        {error && (
          <p className="text-red-600 text-center mb-4 animate-shake">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="
                w-full px-4 py-2 rounded-xl border-2 border-transparent
                focus:outline-none focus:border-pink-600 transition
                shadow-sm
              "
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
              className="
                w-full px-4 py-2 rounded-xl border-2 border-transparent
                focus:outline-none focus:border-pink-600 transition
                shadow-sm
              "
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl font-bold text-white
              bg-gradient-to-r from-pink-600 to-pink-400
              hover:from-pink-700 hover:to-pink-500
              transition-all
              shadow-lg
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6 text-sm">
          Não tem conta?{' '}
          <a
            href={`https://api.whatsapp.com/send?phone=558882170864&text=${encodeURIComponent(
              'Olá! Gostaria de solicitar a criação de uma conta na plataforma da academia.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline"
          >
            Entre em contato pelo WhatsApp
          </a>
        </p>
        <p className="text-center mt-4">
          <a href="/privacidade" className="text-xs text-gray-400 hover:text-pink-500 transition-colors">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}

