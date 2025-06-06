// data/assets.ts

export interface Asset {
  id: string;
  name: string;
  value: number;
  assignedTo?: string;
}

export const mockAssets: Asset[] = [
  {
    id: 'ast001',
    name: 'Notebook Dell XPS 15',
    value: 1500,
    assignedTo: 'Ana Silva', 
  },
  {
    id: 'ast002',
    name: 'Monitor LG Ultrawide',
    value: 800,
    assignedTo: 'Bruno Costa',
  },
  {
    id: 'ast003',
    name: 'Licença Adobe Creative Cloud',
    value: 600,
    assignedTo: 'Carla Dias',
  },
  {
    id: 'ast004',
    name: 'Software de Gestão X',
    value: 1200,
    assignedTo: 'Departamento de TI',
  },
];