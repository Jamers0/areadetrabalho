import React, { useState } from 'react';
import { ApiResponse } from '../types';
import { ExcelService } from '../services/excelService';

interface FileUploadProps {
  onSuccess: (data: ApiResponse) => void;
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onSuccess,
  onError,
  loading,
  setLoading
}) => {
  const [orderFile, setOrderFile] = useState<File | null>(null);
  const [stockFile, setStockFile] = useState<File | null>(null);
  const excelService = new ExcelService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderFile || !stockFile) {
      onError('Por favor, selecione ambos os arquivos');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Iniciando processamento local dos arquivos...');
      const processedData = await excelService.processFiles(orderFile, stockFile);

      if (processedData.length === 0) {
        onError('Nenhum dado foi processado. Verifique o formato dos arquivos.');
        return;
      }

      // Agrupar por setor para facilitar a visualização
      const groupedBySector = processedData.reduce((acc, item) => {
        if (!acc[item.sector]) {
          acc[item.sector] = [];
        }
        acc[item.sector].push(item);
        return acc;
      }, {} as Record<string, typeof processedData>);

      // Agrupar por departamento
      const groupedByDepartment = processedData.reduce((acc, item) => {
        if (!acc[item.department]) acc[item.department] = [];
        acc[item.department].push(item);
        return acc;
      }, {} as Record<string, typeof processedData>);

      // Agrupar por cliente
      const groupedByClient = processedData.reduce((acc, item) => {
        if (!acc[item.client]) acc[item.client] = [];
        acc[item.client].push(item);
        return acc;
      }, {} as Record<string, typeof processedData>);

      // Obter dados adicionais
      const clients = excelService.getAvailableClients();
      const departments = [...new Set(processedData.map(item => item.department))];
      const sectors = [...new Set(processedData.map(item => item.sector))];

      const result: ApiResponse = {
        success: true,
        data: processedData,
        groupedBySector,
        groupedByDepartment,
        groupedByClient,
        clients,
        departments,
        sectors,
        summary: {
          totalItems: processedData.length,
          sectorsCount: Object.keys(groupedBySector).length,
          stockItems: processedData.filter(item => item.stockPhoto > 0).length,
          clientsCount: Object.keys(groupedByClient).length,
          departmentsCount: Object.keys(groupedByDepartment).length
        }
      };

      onSuccess(result);
    } catch (error) {
      console.error('Erro no processamento:', error);
      onError('Erro ao processar arquivos Excel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Upload de Arquivos Excel
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo de Pedidos (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setOrderFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              disabled={loading}
            />
            {orderFile && (
              <p className="mt-1 text-sm text-green-600">
                ✓ {orderFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo de Estoque (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setStockFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              disabled={loading}
            />
            {stockFile && (
              <p className="mt-1 text-sm text-green-600">
                ✓ {stockFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!orderFile || !stockFile || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processando...
          </div>
        ) : (
          'Processar Arquivos Excel'
        )}
      </button>

      <div className="text-sm text-gray-600 mt-4">
        <p><strong>Instruções:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Selecione primeiro o arquivo de pedidos (.xlsx)</li>
          <li>Depois selecione o arquivo de estoque (.xlsx)</li>
          <li>Clique em "Processar Arquivos Excel" para iniciar</li>
          <li>O processamento é feito localmente no seu navegador</li>
        </ul>
      </div>
    </form>
  );
};
