import * as XLSX from 'xlsx';
import { OrderData, StockData, ProcessedData, FilterOptions, ClientMapping } from '../types';
import { ClientMappingService } from './clientMappingService';

export class ExcelService {
  private clientService: ClientMappingService;

  constructor() {
    this.clientService = new ClientMappingService();
  }

  private processOrderFile(file: File): Promise<OrderData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          console.log('=== INICIANDO PROCESSAMENTO DE PEDIDOS ===');
          
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          console.log('Planilhas encontradas:', workbook.SheetNames);
          
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          console.log('Range da planilha:', worksheet['!ref']);
          
          // Ler todas as linhas primeiro
          const allRows = XLSX.utils.sheet_to_json<any>(worksheet, { 
            raw: false,
            header: 1,
            defval: ''
          });
          
          console.log('Total de linhas:', allRows.length);
          console.log('Primeiras 10 linhas:', allRows.slice(0, 10));
          
          // Vamos identificar onde está o cabeçalho
          let headerRowIndex = -1;
          
          for (let i = 0; i < Math.min(10, allRows.length); i++) {
            const row = allRows[i] as string[];
            console.log(`Linha ${i + 1}:`, row);
            
            // Procurar por "Material" no cabeçalho
            if (row.some(cell => cell && cell.toString().toLowerCase().includes('material'))) {
              headerRowIndex = i;
              console.log(`CABEÇALHO ENCONTRADO NA LINHA ${i + 1}:`, row);
              break;
            }
          }
          
          if (headerRowIndex === -1) {
            console.error('Cabeçalho não encontrado!');
            resolve([]);
            return;
          }
          
          // Processar dados a partir da linha após o cabeçalho
          const dataRows = allRows.slice(headerRowIndex + 1);
          const headerRow = allRows[headerRowIndex] as string[];
          
          console.log('Linhas de dados:', dataRows.length);
          console.log('Header:', headerRow);
          
          // Encontrar índices das colunas importantes
          const materialIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('material'));
          const qtdPlanIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('qtd plan'));
          const uomIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('uom'));
          const unidadeIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('unidade'));
          const clienteIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('cliente'));
          const planejadaIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('planeada'));
          const observacoesIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('observ'));
          
          console.log('Índices encontrados:', {
            material: materialIndex,
            qtdPlan: qtdPlanIndex,
            uom: uomIndex,
            unidade: unidadeIndex,
            cliente: clienteIndex,
            planeada: planejadaIndex,
            observacoes: observacoesIndex
          });
          
          const processedOrders = dataRows.map((row: any[], index) => {
            if (!Array.isArray(row)) return null;
            
            const material = row[materialIndex] || '';
            const qtdPlan = row[qtdPlanIndex] || '0';
            const uom = row[uomIndex] || '';
            const unidade = row[unidadeIndex] || '';
            const cliente = row[clienteIndex] || '';
            const planeada = row[planejadaIndex] || '';
            const observacoes = row[observacoesIndex] || '';
            
            if (!material || material.toString().trim() === '') {
              return null;
            }
            
            // Extrair código (primeiros 8 caracteres) e descrição
            const materialStr = material.toString();
            const code = materialStr.substring(0, 8).trim();
            const description = materialStr.includes(' - ') 
              ? materialStr.split(' - ').slice(1).join(' - ').trim()
              : materialStr.substring(8).trim();
            
            // Converter quantidade
            const quantity = parseFloat(qtdPlan.toString().replace(',', '.')) || 0;
            
            const result = {
              code,
              material: description,
              quantity,
              uom: uom.toString(),
              sector: unidade.toString(),
              client: cliente.toString(),
              plannedDate: planeada.toString(),
              observations: observacoes.toString(),
              isNextDay: observacoes.toString().includes('D+1')
            };
            
            if (index < 5) {
              console.log(`Pedido ${index + 1}:`, result);
            }
            
            return result;
          }).filter(Boolean) as OrderData[];
          
          console.log(`=== PEDIDOS PROCESSADOS: ${processedOrders.length} ===`);
          resolve(processedOrders);
          
        } catch (error) {
          console.error('Erro ao processar arquivo de pedidos:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  private processStockFile(file: File): Promise<StockData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          console.log('=== INICIANDO PROCESSAMENTO DE ESTOQUE ===');
          
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          console.log('Planilhas encontradas:', workbook.SheetNames);
          
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          console.log('Range da planilha:', worksheet['!ref']);
          
          // Ler todas as linhas primeiro
          const allRows = XLSX.utils.sheet_to_json<any>(worksheet, { 
            raw: false,
            header: 1,
            defval: ''
          });
          
          console.log('Total de linhas:', allRows.length);
          console.log('Primeiras 10 linhas:', allRows.slice(0, 10));
          
          // Procurar pelo cabeçalho
          let headerRowIndex = -1;
          
          for (let i = 0; i < Math.min(10, allRows.length); i++) {
            const row = allRows[i] as string[];
            console.log(`Linha ${i + 1}:`, row);
            
            if (row.some(cell => cell && (
              cell.toString().toLowerCase().includes('nº') || 
              cell.toString().toLowerCase().includes('código') ||
              cell.toString().toLowerCase().includes('inventário')
            ))) {
              headerRowIndex = i;
              console.log(`CABEÇALHO ENCONTRADO NA LINHA ${i + 1}:`, row);
              break;
            }
          }
          
          if (headerRowIndex === -1) {
            console.error('Cabeçalho de estoque não encontrado!');
            resolve([]);
            return;
          }
          
          const dataRows = allRows.slice(headerRowIndex + 1);
          const headerRow = allRows[headerRowIndex] as string[];
          
          // Encontrar índices das colunas
          const codigoIndex = headerRow.findIndex(h => h && (
            h.toString().toLowerCase().includes('nº') || 
            h.toString().toLowerCase().includes('código')
          ));
          const descricaoIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('descrição'));
          const inventarioIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('inventário'));
          const classeIndex = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('classe'));
          
          console.log('Índices encontrados:', {
            codigo: codigoIndex,
            descricao: descricaoIndex,
            inventario: inventarioIndex,
            classe: classeIndex
          });
          
          const processedStock = dataRows.map((row: any[], index) => {
            if (!Array.isArray(row)) return null;
            
            const codigo = row[codigoIndex] || '';
            const descricao = row[descricaoIndex] || '';
            const inventario = row[inventarioIndex] || '0';
            const classe = row[classeIndex] || '';
            
            if (!codigo || codigo.toString().trim() === '') {
              return null;
            }
            
            const inventory = parseFloat(inventario.toString().replace(',', '.')) || 0;
            
            const result = {
              code: codigo.toString().trim(),
              description: descricao.toString(),
              inventory,
              storageClass: this.mapStorageClass(classe.toString())
            };
            
            if (index < 5) {
              console.log(`Estoque ${index + 1}:`, result);
            }
            
            return result;
          }).filter(Boolean) as StockData[];
          
          console.log(`=== ESTOQUE PROCESSADO: ${processedStock.length} ===`);
          resolve(processedStock);
          
        } catch (error) {
          console.error('Erro ao processar arquivo de estoque:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  public async processFiles(orderFile: File, stockFile: File): Promise<ProcessedData[]> {
    console.log('=== INICIANDO PROCESSAMENTO COMPLETO ===');
    
    const [orders, stock] = await Promise.all([
      this.processOrderFile(orderFile),
      this.processStockFile(stockFile)
    ]);

    console.log(`Pedidos processados: ${orders.length}`);
    console.log(`Estoque processado: ${stock.length}`);

    if (orders.length === 0) {
      console.error('NENHUM PEDIDO FOI PROCESSADO!');
      return [];
    }

    if (stock.length === 0) {
      console.error('NENHUM ITEM DE ESTOQUE FOI PROCESSADO!');
    }

    // Agrupar pedidos por código + setor + cliente
    const groupedOrders: Record<string, ProcessedData> = {};

    orders.forEach((order, index) => {
      console.log(`Processando pedido ${index + 1}:`, {
        code: order.code,
        material: order.material,
        quantity: order.quantity,
        sector: order.sector,
        client: order.client
      });
      
      // Chave única por código + setor + cliente
      const key = `${order.code}_${order.sector}_${order.client}`;
      
      if (!groupedOrders[key]) {
        const stockItem = stock.find(s => s.code === order.code);
        const clientInfo = this.clientService.getClientBySigla(order.client);
        
        // Extrair data e hora do campo plannedDate
        const plannedDateTime = this.extractDateTimeInfo(order.plannedDate);
        
        // Se não há descrição no pedido, buscar no estoque
        let materialDescription = order.material;
        if (!materialDescription || materialDescription.trim() === '') {
          materialDescription = stockItem?.description || order.code;
        }
        
        groupedOrders[key] = {
          code: order.code,
          material: materialDescription,
          plannedQty: 0,
          executedQty: '',
          uom: order.uom,
          department: this.clientService.mapDepartment(stockItem?.storageClass || 'N/A'),
          stockPhoto: stockItem?.inventory || 0,
          sector: order.sector,
          client: order.client,
          clientCode: clientInfo?.codigo || `C${order.client}`,
          clientName: clientInfo?.nome || order.client,
          plannedDate: plannedDateTime.date,
          plannedHour: plannedDateTime.time,
          isNextDay: order.isNextDay
        };
        
        console.log(`Novo item criado para ${key}:`, groupedOrders[key]);
      }
      
      groupedOrders[key].plannedQty += order.quantity;
    });

    const result = Object.values(groupedOrders);
    console.log(`=== RELATÓRIO FINAL GERADO: ${result.length} itens ===`);
    
    // Mostrar alguns exemplos do resultado
    result.slice(0, 3).forEach((item, index) => {
      console.log(`Resultado ${index + 1}:`, item);
    });
    
    return result;
  }

  private extractDateTimeInfo(plannedDate: string): { date: string; time: string } {
    try {
      // Formato esperado: "2025-06-01 13:30" ou similar
      if (plannedDate.includes(' ')) {
        const [datePart, timePart] = plannedDate.split(' ');
        return {
          date: datePart,
          time: timePart
        };
      }
      
      // Se não tem hora, retornar apenas a data
      return {
        date: plannedDate,
        time: '00:00'
      };
    } catch (error) {
      console.warn('Erro ao processar data/hora:', plannedDate, error);
      return {
        date: plannedDate || new Date().toISOString().split('T')[0],
        time: '00:00'
      };
    }
  }

  public applyFilters(data: ProcessedData[], filters: FilterOptions): ProcessedData[] {
    let filteredData = [...data];

    // Filtro por data
    if (filters.date) {
      const filterDate = filters.date.toISOString().split('T')[0];
      filteredData = filteredData.filter(item => 
        item.plannedDate.includes(filterDate)
      );
    }

    // Filtro por hora
    if (filters.hour) {
      filteredData = filteredData.filter(item => 
        item.plannedHour.includes(filters.hour!)
      );
    }

    // Filtro por clientes incluídos
    if (filters.clients && filters.clients.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.clients!.includes(item.client)
      );
    }

    // Filtro para excluir clientes
    if (filters.excludedClients && filters.excludedClients.length > 0) {
      filteredData = filteredData.filter(item => 
        !filters.excludedClients!.includes(item.client)
      );
    }

    // Filtro por departamentos
    if (filters.departments && filters.departments.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.departments!.includes(item.department)
      );
    }

    // Filtro por setores
    if (filters.sectors && filters.sectors.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.sectors!.includes(item.sector)
      );
    }

    // Filtro D+1
    if (filters.isNextDay !== undefined) {
      filteredData = filteredData.filter(item => 
        item.isNextDay === filters.isNextDay
      );
    }

    return filteredData;
  }

  public getAvailableClients(): ClientMapping[] {
    return this.clientService.getAllClients();
  }

  public getAvailableDepartments(): string[] {
    return ['PRAÇA', 'Congelados', 'Refrigerados', 'Secos', 'Consumíveis', 'Cozinha Quente'];
  }

  public generateReportTitle(
    sector: string, 
    clients: string[], 
    date: Date, 
    hour?: string
  ): string {
    const dateStr = date.toLocaleDateString('pt-BR');
    const hourStr = hour ? ` ${hour}` : '';
    
    let clientStr = 'Geral';
    if (clients.length === 1) {
      const clientInfo = this.clientService.getClientBySigla(clients[0]);
      clientStr = clientInfo?.nome || clients[0];
    } else if (clients.length > 1) {
      clientStr = 'Geral';
    }
    
    return `${sector} ${clientStr} ${dateStr}${hourStr}`;
  }

  private mapStorageClass(storageClass: string): string {
    const mapping: Record<string, string> = {
      'C1': 'Congelados', 'C2': 'Congelados', 'C3': 'Congelados', 'C4': 'Congelados',
      'P': 'PRAÇA', 'PRACA': 'PRAÇA', 'F&V, Pão & Iogurtes': 'PRAÇA', 'PRAÇA': 'PRAÇA',
      'R': 'Refrigerados', 'R4': 'Refrigerados',
      'S': 'Secos', 'Seco': 'Secos', 'Secos': 'Secos', 'AMB.': 'Secos',
      'Secos / Consumíveis': 'Secos', 'CLI': 'Consumíveis'
    };
    return mapping[storageClass] || storageClass;
  }
}
