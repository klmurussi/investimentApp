'use client'; 

import { useState, useEffect } from 'react';
import { mockClients, Client } from '@/mocks/clients';

interface ClientsDashboardProps {
  searchTerm: string;
}

export default function ClientsDashboard({ searchTerm }: ClientsDashboardProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        let filteredClients = mockClients;

        if (searchTerm) {
          filteredClients = mockClients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setClients(filteredClients);
      } catch (err) {
        setError('Erro ao carregar os clientes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [searchTerm]);

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
            <div key={client.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">{client.name}</h2>
              <p className="text-gray-700 mb-1"><strong>Email:</strong> {client.email}</p>
              <p className="text-gray-700"><strong>Status:</strong> {client.status === 'active' ? 'Ativo' : 'Inativo'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}