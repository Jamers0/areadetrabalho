import React, { useState } from 'react';
import { ProcessedData, ApiResponse, FilterOptions, ClientMapping } from '../types';
import { FileUpload } from '../components/FileUpload';
import { Dashboard } from '../components/Dashboard';
import { StatusMessage } from '../components/StatusMessage';

const ReportPage: React.FC = () => {
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const [clients, setClients] = useState<ClientMapping[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [currentFilters] = useState<FilterOptions>({
    date: new Date(),
    excludedClients: []
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleUploadSuccess = (data: ApiResponse) => {
    setProcessedData(data.data || []);
    setClients(data.clients || []);
    setDepartments(data.departments || []);
    setSectors(data.sectors || []);
    setError(null);
    setSuccess(`Arquivos processados com sucesso! ${data.data?.length || 0} itens encontrados.`);
    setShowDashboard(true);
    console.log('Dados processados:', data);
  };

  const handleUploadError = (error: string) => {
    setError(error);
    setSuccess(null);
    setProcessedData([]);
    setClients([]);
    setDepartments([]);
    setSectors([]);
    setShowDashboard(false);
  };

  const handleReset = () => {
    setProcessedData([]);
    setClients([]);
    setDepartments([]);
    setSectors([]);
    setError(null);
    setSuccess(null);
    setShowDashboard(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Processador de Excel
          </h1>
          <p className="text-gray-600">
            Upload e processamento de arquivos Excel para relatórios
          </p>
        </header>

        {error && <StatusMessage message={error} type="error" />}
        {success && <StatusMessage message={success} type="success" />}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <FileUpload
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            loading={loading}
            setLoading={setLoading}
          />
          
          {showDashboard && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Relatório Processado
                </h2>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Processar Novos Arquivos
                </button>
              </div>
            </div>
          )}
        </div>

        {showDashboard && processedData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <Dashboard data={processedData} />
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg">Processando arquivos...</span>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Processador de Excel - Versão unificada para deploy no Netlify</p>
          <p className="mt-1">Processamento local no navegador - Dados não são enviados para servidores</p>
        </footer>
      </div>
    </div>
  );
};

export default ReportPage;
