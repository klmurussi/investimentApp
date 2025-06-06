// app/assets/page.tsx
'use client';

import { useState } from 'react';
import AssetsDashboard from '@/components/AssetsDashboard';
import ManagementLayoutBase from '@/components/DefaultMain';

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNewAssetClick = () => {
    alert('Funcionalidade de "Cadastrar Novo Ativo" será implementada aqui!');
  };

  return (
    <ManagementLayoutBase
      title="Gerenciamento de Ativos"
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Pesquisar por nome do cliente..."
      addLabel="+ Cadastrar Novo Ativo"
      onAddClick={handleNewAssetClick}
    >
      <AssetsDashboard searchTerm={searchTerm} />
    </ManagementLayoutBase>
  );
}