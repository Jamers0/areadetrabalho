import { ClientMapping } from '../types';

export class ClientMappingService {
  private clientMappings: ClientMapping[] = [];

  constructor() {
    this.loadClientMappings();
  }

  private loadClientMappings(): void {
    // Dados hardcoded para funcionar sem arquivos CSV no browser
    this.clientMappings = [
      { sigla: 'EK', nome: 'Emirates Airlines', codigo: 'C000011' },
      { sigla: 'TP', nome: 'TAP Air Portugal', codigo: 'C000020' },
      { sigla: 'DL', nome: 'Delta Airlines', codigo: 'C000010' },
      { sigla: 'KE', nome: 'Korean Air', codigo: 'C000021' },
      { sigla: 'S4', nome: 'SATA', codigo: 'C000022' },
      { sigla: 'DT', nome: 'TAAG', codigo: 'C000023' },
      { sigla: 'AA', nome: 'American Airlines', codigo: 'C000001' },
      { sigla: 'BA', nome: 'British Airways', codigo: 'C000002' },
      { sigla: 'LH', nome: 'Lufthansa', codigo: 'C000003' },
      { sigla: 'AF', nome: 'Air France', codigo: 'C000004' },
      { sigla: 'KL', nome: 'KLM', codigo: 'C000005' },
      { sigla: 'IB', nome: 'Iberia', codigo: 'C000006' },
      { sigla: 'LX', nome: 'Swiss International Air Lines', codigo: 'C000007' },
      { sigla: 'OS', nome: 'Austrian Airlines', codigo: 'C000008' },
      { sigla: 'SN', nome: 'Brussels Airlines', codigo: 'C000009' },
      { sigla: 'UA', nome: 'United Airlines', codigo: 'C000012' },
      { sigla: 'VS', nome: 'Virgin Atlantic', codigo: 'C000013' },
      { sigla: 'QF', nome: 'Qantas', codigo: 'C000014' },
      { sigla: 'SQ', nome: 'Singapore Airlines', codigo: 'C000015' },
      { sigla: 'TK', nome: 'Turkish Airlines', codigo: 'C000016' },
      { sigla: 'EY', nome: 'Etihad Airways', codigo: 'C000017' },
      { sigla: 'QR', nome: 'Qatar Airways', codigo: 'C000018' },
      { sigla: 'WF', nome: 'Widerøe', codigo: 'C000019' }
    ];

    console.log(`Carregados ${this.clientMappings.length} mapeamentos de clientes`);
  }

  public getClientBySigla(sigla: string): ClientMapping | undefined {
    return this.clientMappings.find(client => 
      client.sigla.toLowerCase() === sigla.toLowerCase()
    );
  }

  public getClientByNome(nome: string): ClientMapping | undefined {
    return this.clientMappings.find(client => 
      client.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  public getAllClients(): ClientMapping[] {
    return [...this.clientMappings];
  }

  public mapDepartment(storageClass: string): string {
    const mapping: Record<string, string> = {
      'Congelados': 'Congelados',
      'C1': 'Congelados',
      'C2': 'Congelados', 
      'C3': 'Congelados',
      'C4': 'Congelados',
      'PRAÇA': 'PRAÇA',
      'P': 'PRAÇA',
      'PRACA': 'PRAÇA',
      'F&V, Pão & Iogurtes': 'PRAÇA',
      'Refrigerados': 'Refrigerados',
      'R': 'Refrigerados',
      'R4': 'Refrigerados',
      'Secos': 'Secos',
      'S': 'Secos',
      'Seco': 'Secos',
      'AMB.': 'Secos',
      'Secos / Consumíveis': 'Secos',
      'Consumíveis': 'Consumíveis',
      'CLI': 'Consumíveis',
      'Cozinha Quente': 'Cozinha Quente'
    };

    return mapping[storageClass] || 'Outros';
  }

  public addClient(client: ClientMapping): void {
    const existingIndex = this.clientMappings.findIndex(c => c.sigla === client.sigla);
    if (existingIndex >= 0) {
      this.clientMappings[existingIndex] = client;
    } else {
      this.clientMappings.push(client);
    }
  }

  public removeClient(sigla: string): boolean {
    const index = this.clientMappings.findIndex(c => c.sigla === sigla);
    if (index >= 0) {
      this.clientMappings.splice(index, 1);
      return true;
    }
    return false;
  }
}
