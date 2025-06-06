'use client';

import { useState } from 'react';
import ClientsDashboard from '@/components/ClientsDashboard';
import ManagementLayoutBase from '@/components/DefaultMain';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNewClientClick = () => {
    alert('Funcionalidade de "Cadastrar Novo Cliente" será implementada aqui!');
  };

  return (
    <ManagementLayoutBase
      title="Gerenciamento de Clientes"
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Pesquisar por nome..."
      addLabel="+ Cadastrar Novo Cliente"
      onAddClick={handleNewClientClick}
    >
      <ClientsDashboard searchTerm={searchTerm} />
    </ManagementLayoutBase>
  );
}