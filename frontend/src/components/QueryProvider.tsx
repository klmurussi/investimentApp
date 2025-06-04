// frontend/src/components/QueryProvider.tsx
'use client'; // <-- ESSENCIAL! Torna este um Client Component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient(); // Instancie AQUI, dentro do Client Component

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}