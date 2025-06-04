'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const clientFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/clients'); // Use a URL do backend
      return response.data;
    },
  });

  const createClientMutation = useMutation({
    mutationFn: (newClient: ClientFormValues) => axios.post('http://localhost:3000/clients', newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsNewClientDialogOpen(false);
      reset(); // Reset form after successful submission
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, ...updatedClient }: Client) => axios.put(`http://localhost:3000/clients/${id}`, updatedClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setEditingClient(null);
      reset(); // Reset form after successful submission
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`http://localhost:3000/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
  });

  useEffect(() => {
    if (editingClient) {
      setValue('name', editingClient.name);
      setValue('email', editingClient.email);
      setValue('status', editingClient.status);
    } else {
      reset();
    }
  }, [editingClient, setValue, reset]);

  const onSubmit = (data: ClientFormValues) => {
    if (editingClient) {
      updateClientMutation.mutate({ id: editingClient.id, ...data });
    } else {
      createClientMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Carregando clientes...</div>;
  if (error) return <div>Erro ao carregar clientes: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Clientes</h1>

      <Dialog open={isNewClientDialogOpen || !!editingClient} onOpenChange={(open) => {
        if (!open) {
          setIsNewClientDialogOpen(false);
          setEditingClient(null);
        }
      }}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsNewClientDialogOpen(true)} className="mb-4">Adicionar Novo Cliente</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</DialogTitle>
            <DialogDescription>
              {editingClient ? 'Faça alterações no cliente.' : 'Preencha os detalhes do novo cliente.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" {...register('name')} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" {...register('email')} className="col-span-3" />
              {errors.email && <p className="col-span-4 text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={(value: string) => setValue('status', value as 'ACTIVE' | 'INACTIVE')} defaultValue={editingClient?.status || 'ACTIVE'}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="col-span-4 text-red-500 text-sm">{errors.status.message}</p>}
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingClient(client)}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteClientMutation.mutate(client.id)}>
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}