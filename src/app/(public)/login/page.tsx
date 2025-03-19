"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../assets/logo.jpg';
import { login } from '../../../services/authService';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const data = await login({ username, password });
      document.cookie = `access_token=${data.token.access_token}; path=/;`
      document.cookie = `user_type=${data.role}; path=/;`
      document.cookie = `userId=${data.userId}; path=/;`
      document.cookie = `companyId=${data.companyId}; path=/;`

      if(data.role === "client")
        router.push('/dashboard');
      if (data.role === "admin")
        router.push('/');

    } catch (error) {
      setError(`Erro ao realizar login: ${error}`);
    }
  }

  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

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
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Entrar
        </button>
      </form>
    </div>
  );
}
