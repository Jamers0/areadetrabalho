// Tipos unificados para o projeto
export interface Order {
  code: string;
  material: string;
  quantityPlanned: number;
  quantityExecuted: number;
  unitOfMeasure: string;
  department: string;
  stockLocation: string;
}

export interface Client {
  id: number;
  name: string;
}

export interface ExcelData {
  orders: Order[];
  clients: Client[];
}

export interface ProcessedData {
  code: string;
  material: string;
  plannedQty: number;
  executedQty: string;
  uom: string;
  department: string;
  stockPhoto: number;
  sector: string;
  client: string;
  clientCode: string;
  clientName: string;
  plannedDate: string;
  plannedHour: string;
  isNextDay: boolean;
}

export interface ClientMapping {
  sigla: string;
  nome: string;
  codigo: string;
}

export interface FilterOptions {
  date?: Date;
  hour?: string;
  clients?: string[];
  excludedClients?: string[];
  departments?: string[];
  sectors?: string[];
  isNextDay?: boolean;
}

export interface ApiResponse {
  success: boolean;
  data?: ProcessedData[];
  groupedBySector?: Record<string, ProcessedData[]>;
  groupedByDepartment?: Record<string, ProcessedData[]>;
  groupedByClient?: Record<string, ProcessedData[]>;
  clients?: ClientMapping[];
  departments?: string[];
  sectors?: string[];
  summary?: {
    totalItems: number;
    sectorsCount: number;
    stockItems: number;
    clientsCount: number;
    departmentsCount: number;
  };
  error?: string;
}

// Tipos para processamento Excel
export interface ExcelOrderRow {
  codigo: string;
  material: string;
  quantidade: number;
  unidade: string;
  setor: string;
  cliente: string;
  dataPlanejada: string;
  observacoes?: string;
}

export interface ExcelStockRow {
  codigo: string | number;
  estoque: string | number;
  classe?: string;
}

export interface OrderData {
  code: string;
  material: string;
  quantity: number;
  uom: string;
  sector: string;
  client: string;
  plannedDate: string;
  observations: string;
  isNextDay: boolean;
}

export interface StockData {
  code: string;
  description: string;
  inventory: number;
  storageClass: string;
}

export interface ProcessedReport {
  sectors: Map<string, ProcessedData[]>;
  totalItems: number;
  stockItems: number;
  clients: ClientMapping[];
  departments: string[];
  availableSectors: string[];
}
