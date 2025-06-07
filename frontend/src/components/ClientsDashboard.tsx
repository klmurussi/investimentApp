'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE'; 
}


interface ClientsDashboardProps {
  searchTerm: string;
}

export default function ClientsDashboard({ searchTerm }: ClientsDashboardProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = 'http://localhost:5000'; 
        let url = `${API_URL}/clients`;

        if (searchTerm) {
          url += `?search=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar clientes.');
        }

        const data: Client[] = await response.json();
        setClients(data);

      } catch (err) {
        console.error("Erro ao carregar clientes do backend:", err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [searchTerm]);

  const handleClientClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-xl font-semibold text-blue-600">Carregando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-xl font-semibold text-red-600">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8"> 
      {clients.length === 0 && !searchTerm ? ( 
        <p className="text-gray-600 text-lg">Nenhum cliente cadastrado.</p>
      ) : clients.length === 0 && searchTerm ? (
        <p className="text-gray-600 text-lg">Nenhum cliente encontrado com "{searchTerm}".</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div key={client.id} 
            onClick={() => handleClientClick(client.id)}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">{client.name}</h2>
              <p className="text-gray-700 mb-1"><strong>Email:</strong> {client.email}</p>
              <p className="text-gray-700"><strong>Status:</strong> {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}