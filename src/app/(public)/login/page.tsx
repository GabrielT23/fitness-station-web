"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../assets/logo.jpg';
import { login } from '../../../services/authService';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      if (!trimmedUsername || !trimmedPassword) {
        toast.error('Preencha todos os campos');
        return;
      }
      setLoading(true);
      const data = await login({ username: trimmedUsername, password: trimmedPassword });
      document.cookie = `access_token=${data.token.access_token}; path=/;`;
      document.cookie = `user_type=${data.role}; path=/;`;
      document.cookie = `userId=${data.userId}; path=/;`;
      document.cookie = `companyId=${data.companyId}; path=/;`;
      setLoading(false);
      if (data.role === "client") router.push('/dashboard');
      if (data.role === "admin") router.push('/');
    } catch {
      setLoading(false);
      setError(`usuário ou senha inválidos`);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="mb-5">
        <Image src={Logo} alt="Logo" width={200} height={200} />
      </div>
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          className="border p-2 mb-4 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="senha"
          className="border p-2 mb-4 w-full"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {loading ? 'Carregando...': 'Entrar'}
        </button>
      </form>
    </div>
  );
}
