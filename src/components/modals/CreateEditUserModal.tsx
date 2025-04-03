import { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { User, CreateUserRequest } from '@/services/usersServices';
import { useAuth } from '@/hooks/useAuth';

interface CreateEditUserModalProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
}

const CreateEditUserModal: React.FC<CreateEditUserModalProps> = ({ user, isOpen, onClose }) => {
  const { addUser, editUser } = useUsers();
  const [name, setName] = useState(user ? user.name : '');
  const [username, setUsername] = useState(user ? user.username : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user ? user.role : '');
  const { user: userLogged } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setRole(user.role);
    } else {
      setName('');
      setUsername('');
      setRole('');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remover espaços adicionais
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedRole = role.trim();

    const userData: CreateUserRequest = {
      name: trimmedName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: trimmedRole,
      companyId: userLogged?.companyId || '',
    };

    if (user) {
      if (trimmedPassword) {
        await editUser(
          {
            name: trimmedName || user.name,
            username: trimmedUsername || user.username,
            role: trimmedRole || user.role,
            password: trimmedPassword,
            companyId: user.companyId,
          },
          user.id
        );
      } else {
        await editUser(
          {
            name: trimmedName || user.name,
            username: trimmedUsername || user.username,
            role: trimmedRole || user.role,
            companyId: user.companyId,
          },
          user.id
        );
      }
    } else {
      await addUser(userData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">{user ? 'Editar Usuário' : 'Criar Usuário'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded"
              required={!user}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Função</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Selecione uma função</option>
              <option value="admin">Administrador</option>
              <option value="client">Aluno</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              {user ? 'Salvar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditUserModal;