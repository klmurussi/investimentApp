'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AssetsDashboard from '@/components/AssetsDashboard';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export default function ClientDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter(); 
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; 

    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_URL = 'http://localhost:5000';
        const response = await fetch(`${API_URL}/clients/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Cliente não encontrado.');
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar detalhes do cliente.');
        }

        const data: Client = await response.json();
        setClient(data);
      } catch (err: any) {
        console.error("Erro ao carregar detalhes do cliente:", err);
        setError(err.message || 'Ocorreu um erro ao carregar os detalhes do cliente.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]); 

  const handleCreateAssetClick = () => {
    router.push(`/clients/${id}/newAsset`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl font-semibold text-blue-600">Carregando detalhes do cliente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl font-semibold text-red-600">Erro: {error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Voltar para a lista de clientes
        </Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-600">Nenhum cliente encontrado com este ID.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Voltar para a lista de clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Detalhes do Cliente</h1>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <p className="text-gray-700 mb-2"><strong>ID:</strong> {client.id}</p>
        <p className="text-gray-700 mb-2"><strong>Nome:</strong> {client.name}</p>
        <p className="text-gray-700 mb-2"><strong>Email:</strong> {client.email}</p>
        <p className="text-gray-700 mb-2"><strong>Status:</strong> {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</p>
        
        <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Ativos do Cliente</h2>
                <Button onClick={handleCreateAssetClick}>
                    + Adicionar Ativo
                </Button>
            </div>
            <AssetsDashboard initialClientId={client.id} />
        </div>

        <div className="flex justify-between mt-6">
          <Button onClick={() => router.back()} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}