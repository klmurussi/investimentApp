'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface Asset {
  id: string; 
  name: string;
  value: number; 
  clientName: string; 
  clientID: string; 
}

interface AssetsDashboardProps {
  initialClientId?: string; 
}

export default function AssetsDashboard({ initialClientId }: AssetsDashboardProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_URL = 'http://localhost:5000';
        let url = '';
        const queryParams = new URLSearchParams();

        if (initialClientId) {
          url = `${API_URL}/assets/${initialClientId}`;
        } else {
          url = `${API_URL}/assets`;
        }

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar ativos.');
        }

        const data: Asset[] = await response.json();
        setAssets(data);

      } catch (err: any) {
        console.error("Erro ao carregar ativos do backend:", err);
        setError(err.message || 'Ocorreu um erro ao carregar os ativos.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [initialClientId]); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-xl font-semibold text-purple-600">Carregando ativos...</p>
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

      {assets.length === 0 ? (
        <p className="text-gray-600 text-lg">Nenhum ativo cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map(asset => (
            <div key={asset.id} className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <h2 className="font-semibold text-purple-700 mb-2">{asset.name}</h2>
              <p className="text-gray-700 mb-1"><strong>Valor:</strong> {asset.value}</p>
              {/* Mostra o nome do cliente apenas se não estiver listando ativos de um cliente específico */}
              {!initialClientId && (
                 <p className="text-gray-700"><strong>Cliente:</strong> {asset.clientName}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}