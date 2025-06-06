'use client'; 

import { useState, useEffect } from 'react';
import { mockAssets, Asset } from '@/mocks/assets';  

interface AssetsDashboardProps {
  searchTerm: string;
}

export default function AssetsDashboard({ searchTerm }: AssetsDashboardProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        let filteredAssets = mockAssets;

        if (searchTerm) {
          filteredAssets = mockAssets.filter(asset =>
            asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setAssets(filteredAssets);
      } catch (err) {
        setError('Erro ao carregar os ativos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [searchTerm]); 

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
      {assets.length === 0 && !searchTerm  ? (
        <p className="text-gray-600 text-lg">Nenhum ativo cadastrado.</p>
      ) : assets.length === 0 ? (
        <p className="text-gray-600 text-lg">Nenhum ativo encontrado com os "{searchTerm}".</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map(asset => (
            <div key={asset.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-purple-700 mb-2">{asset.name}</h2>
              <p className="text-gray-700 mb-1"><strong>Valor:</strong> {asset.value}</p>
              {asset.assignedTo && <p className="text-gray-700"><strong>Atribuído a:</strong> {asset.assignedTo}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}