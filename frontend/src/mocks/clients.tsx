export interface Client {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export const mockClients: Client[] = [
  {
    id: 'clt001',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    status: 'active', 
  },
  {
    id: 'clt002',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    status: 'inactive',
  },
  {
    id: 'clt003',
    name: 'Carla Dias',
    email: 'carla.dias@example.com',
    status: 'active',
  },
  {
    id: 'clt004',
    name: 'Daniel Rocha',
    email: 'daniel.rocha@example.com',
    status: 'active',
  },
];