import React, { useMemo, useState } from 'react';
import { ProcessedData } from '../types';

interface Props {
  data: ProcessedData[];
}

export const Dashboard: React.FC<Props> = ({ data }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const filteredData = useMemo(() => {
    return selectedDepartment === 'all' 
      ? data 
      : data.filter(item => item.department === selectedDepartment);
  }, [data, selectedDepartment]);

  const stats = useMemo(() => {
    return {
      totalItems: filteredData.length,
      totalQuantity: filteredData.reduce((sum, item) => sum + item.plannedQty, 0),
      departments: [...new Set(data.map(item => item.department))],
      sectors: [...new Set(data.map(item => item.sector))],
      clients: [...new Set(data.map(item => item.client))],
      lowStock: filteredData.filter(item => item.stockPhoto < item.plannedQty).length,
      withStock: filteredData.filter(item => item.stockPhoto > 0).length
    };
  }, [filteredData, data]);

  const departmentStats = useMemo(() => {
    return stats.departments.map(dept => ({
      name: dept,
      items: data.filter(item => item.department === dept).length,
      quantity: data
        .filter(item => item.department === dept)
        .reduce((sum, item) => sum + item.plannedQty, 0)
    }));
  }, [data, stats.departments]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total de Itens</h3>
          <p className="text-2xl font-bold text-blue-900">{stats.totalItems}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Quantidade Total</h3>
          <p className="text-2xl font-bold text-green-900">{stats.totalQuantity}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Com Estoque</h3>
          <p className="text-2xl font-bold text-yellow-900">{stats.withStock}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Estoque Baixo</h3>
          <p className="text-2xl font-bold text-red-900">{stats.lowStock}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="flex gap-4 mb-4">
          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="all">Todos os Departamentos</option>
            {stats.departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Estatísticas por Departamento</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Departamento</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Itens</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept, index) => (
                <tr key={dept.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-900">{dept.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{dept.items}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{dept.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Resumo Geral</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-700">Departamentos</h4>
            <p className="text-lg font-semibold">{stats.departments.length}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Setores</h4>
            <p className="text-lg font-semibold">{stats.sectors.length}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Clientes</h4>
            <p className="text-lg font-semibold">{stats.clients.length}</p>
          </div>
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Dados Filtrados 
            {selectedDepartment !== 'all' && ` - ${selectedDepartment}`}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Código</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Material</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qtd</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Estoque</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cliente</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Setor</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 50).map((item, index) => (
                  <tr key={`${item.code}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-xs text-gray-900">{item.code}</td>
                    <td className="px-3 py-2 text-xs text-gray-900 max-w-xs truncate">{item.material}</td>
                    <td className="px-3 py-2 text-xs text-gray-900">{item.plannedQty}</td>
                    <td className={`px-3 py-2 text-xs ${item.stockPhoto < item.plannedQty ? 'text-red-600' : 'text-green-600'}`}>
                      {item.stockPhoto}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900">{item.client}</td>
                    <td className="px-3 py-2 text-xs text-gray-900">{item.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 50 && (
              <p className="text-sm text-gray-500 mt-2">
                Mostrando primeiros 50 de {filteredData.length} itens
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
