'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';  

export default function NewClientPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const API_URL = 'http://localhost:5000'; 
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao cadastrar cliente.');
      }

      const newClient = await response.json();
      setSuccess(`Cliente "${newClient.name}" cadastrado com sucesso!`);
      setName('');
      setEmail('');
      setStatus('ACTIVE');
      router.push('/clients'); 
    } catch (err: any) {
      console.error('Erro ao cadastrar cliente:', err);
      setError(err.message || 'Ocorreu um erro no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Cadastrar Novo Cliente</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Nome
          </label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo do cliente"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Cliente'}
        </Button>
      </form>
    </div>
  );
}