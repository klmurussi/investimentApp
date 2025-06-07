'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientsDashboard from '@/components/ClientsDashboard';
import ManagementLayoutBase from '@/components/DefaultMain';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNewClientClick = () => {
    router.push('/clients/new');
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