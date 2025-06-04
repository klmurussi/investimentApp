'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Asset {
  name: string;
  value: number;
}

export default function AssetsPage() {
  const { data: assets, isLoading, error } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/assets'); // Use a URL do backend
      return response.data;
    },
  });

  if (isLoading) return <div>Carregando ativos...</div>;
  if (error) return <div>Erro ao carregar ativos: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ativos Financeiros Disponíveis</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Ativo</TableHead>
            <TableHead className="text-right">Valor Atual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets?.map((asset) => (
            <TableRow key={asset.name}>
              <TableCell>{asset.name}</TableCell>
              <TableCell className="text-right">{asset.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}