'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ManagementLayoutBaseProps {
  title: string;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder: string;
  addLabel: string;
  onAddClick: () => void;
  children: React.ReactNode;
}

export default function ManagementLayoutBase({
  title,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  addLabel,
  onAddClick,
  children,
}: ManagementLayoutBaseProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">{title}</h1>

      {/* Barra de Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        {/* Campo de Pesquisa */}
        <div className="w-full sm:w-2/3">
          <label htmlFor="search" className="sr-only">Pesquisar</label>
          <Input
            type="text"
            id="search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full"
          />
        </div>

        {/* Botão de Cadastrar Novo */}
        <div className="w-full sm:w-1/3">
          <Button
            onClick={onAddClick}
            className="w-full"
          >
            {addLabel}
          </Button>
        </div>
      </div>

      {/* Área onde o Dashboard específico será renderizado */}
      {children}
    </div>
  );
}