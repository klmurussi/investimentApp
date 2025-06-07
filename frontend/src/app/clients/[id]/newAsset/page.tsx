'use client';

import { useState, useEffect } from 'react'; 
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ZodErrorDetail {
  code: string;
  expected?: string;
  received?: string;
  path: string[];
  message: string;
}

export default function NewAssetPage() {
  const { id: clientID } = useParams();
  const router = useRouter();

  const [assetName, setAssetName] = useState(''); 
  const [quantity, setQuantity] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ZodErrorDetail[] | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clientName, setClientName] = useState('...'); 

  useEffect(() => {
    if (!clientID) return;
    const fetchClientName = async () => {
      try {
        const API_URL = 'http://localhost:5000';
        const response = await fetch(`${API_URL}/clients/${clientID}`);
        if (response.ok) {
          const clientData = await response.json();
          setClientName(clientData.name || 'Cliente Desconhecido');
        }
      } catch (err) {
        console.error('Erro ao buscar nome do cliente:', err);
      }
    };
    fetchClientName();
  }, [clientID]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors(null); 
    setSuccess(null);

    if (!assetName || quantity === '' || quantity <= 0) {
      setError('Por favor, preença o nome do ativo e uma quantidade válida (> 0).'); 
      setLoading(false);
      return;
    }

    try {
      const API_URL = 'http://localhost:5000';
      const response = await fetch(`${API_URL}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: assetName, 
          value: parseFloat(String(quantity)), 
          clientID: String(clientID),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors && Array.isArray(errorData.errors)) {
          setValidationErrors(errorData.errors); 
          setError(errorData.message || 'Falha na validação do formulário.'); 
        } else {
          throw new Error(errorData.message || 'Falha ao cadastrar ativo.');
        }
      } else {
        const newAsset = await response.json();
        setSuccess(`Ativo "${newAsset.name}" cadastrado com sucesso!`);
        setAssetName('');
        setQuantity('');

        setTimeout(() => {
          router.push(`/clients/${clientID}`);
        }, 1500);
      }

    } catch (err: any) {
      console.error('Erro ao cadastrar ativo:', err);
      setError(err.message || 'Ocorreu um erro no cadastro do ativo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Adicionar Ativo para {clientName}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {/* NOVO: Exibe os erros de validação detalhados do Zod */}
        {validationErrors && (
          <ul className="text-red-600 mb-4 list-disc list-inside">
            {validationErrors.map((err, index) => (
              <li key={index}>
                <strong>{err.path.join('.') || 'Campo Desconhecido'}</strong>: {err.message}
              </li>
            ))}
          </ul>
        )}
        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

        <div className="mb-4">
          <label htmlFor="assetName" className="block text-gray-700 text-sm font-bold mb-2">
            Nome do Ativo
          </label>
          <Input
            type="text"
            id="assetName"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="Ex: Ação XYZ, Fundo ABC"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
            Quantidade
          </label>
          <Input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || '')}
            placeholder="Ex: 10.5, 100"
            step="0.01"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Adicionando Ativo...' : 'Adicionar Ativo'}
        </Button>
        <Button
          type="button"
          onClick={() => router.push(`/clients/${clientID}`)}
          variant="outline"
          className="w-full mt-2"
        >
          Cancelar
        </Button>
      </form>
    </div>
  );
}