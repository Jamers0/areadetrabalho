# Processador de Excel Unificado

Este projeto é uma versão unificada do processador de Excel, combinando frontend e backend em um único projeto React que pode ser facilmente deployado no Netlify.

## 🚀 Características

- **Processamento local**: Todo o processamento de Excel é feito no navegador do usuário
- **Sem servidor**: Não requer backend - funciona completamente no frontend
- **Deploy simples**: Pronto para deploy no Netlify
- **Interface responsiva**: Funciona bem em desktop e mobile
- **Processamento offline**: Funciona sem conexão com internet após carregamento

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx    # Dashboard com estatísticas
│   ├── FileUpload.tsx   # Upload e processamento de arquivos
│   └── StatusMessage.tsx # Mensagens de status
├── pages/
│   └── ReportPage.tsx   # Página principal
├── services/
│   ├── excelService.ts  # Serviço de processamento Excel
│   └── clientMappingService.ts # Mapeamento de clientes
├── types/
│   └── index.ts         # Definições de tipos TypeScript
├── App.tsx              # Componente principal
├── index.tsx            # Entry point
└── index.css            # Estilos CSS
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Styling
- **XLSX** - Processamento de arquivos Excel
- **React Router DOM** - Roteamento

## 🔧 Instalação e Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm start
   ```

3. **Build para produção:**
   ```bash
   npm run build
   ```

## 🌐 Deploy no Netlify

### Opção 1: Deploy via Git

1. Faça push do código para um repositório Git (GitHub, GitLab, etc.)
2. Conecte o repositório ao Netlify
3. Configure o build:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
4. Deploy automático será feito

### Opção 2: Deploy manual

1. Execute `npm run build`
2. Faça upload da pasta `build` no Netlify
3. Seu site estará disponível

## 📊 Como Usar

1. **Upload de Arquivos:**
   - Selecione o arquivo de pedidos (.xlsx)
   - Selecione o arquivo de estoque (.xlsx)
   - Clique em "Processar Arquivos Excel"

2. **Visualização:**
   - Veja estatísticas no dashboard
   - Filtre por departamento
   - Analise dados processados

3. **Recursos:**
   - Processamento é feito localmente
   - Dados não são enviados para servidores
   - Interface responsiva e intuitiva

## 🔒 Segurança e Privacidade

- **Processamento local**: Todos os arquivos são processados no navegador
- **Sem upload**: Arquivos não são enviados para servidores
- **Privacidade total**: Seus dados permanecem no seu computador

## 📋 Formatos Suportados

### Arquivo de Pedidos
- Deve conter colunas: Material, Qtd Plan, UoM, Unidade, Cliente, Planeada, Observações
- Formato: .xlsx ou .xls

### Arquivo de Estoque
- Deve conter colunas: Nº/Código, Descrição, Inventário, Classe
- Formato: .xlsx ou .xls

## 🎯 Funcionalidades

- ✅ Upload e processamento de arquivos Excel
- ✅ Mapeamento automático de clientes
- ✅ Agrupamento por departamento/setor
- ✅ Estatísticas em tempo real
- ✅ Interface responsiva
- ✅ Processamento offline
- ✅ Feedback visual do processo

## 🔧 Configurações

O projeto vem pré-configurado com mapeamentos de clientes. Para adicionar novos clientes, edite o arquivo `src/services/clientMappingService.ts`.

## 🚨 Limitações

- Funciona apenas com arquivos .xlsx/.xls
- Processamento limitado pela memória do navegador
- Requer JavaScript habilitado

## 📞 Suporte

Se encontrar problemas:

1. Verifique se os arquivos Excel estão no formato correto
2. Certifique-se de que JavaScript está habilitado
3. Tente com arquivos menores se houver problemas de memória
4. Verifique o console do navegador para detalhes de erro

## 🔄 Atualizações

Este projeto foi convertido de uma arquitetura cliente-servidor para uma aplicação puramente frontend para compatibilidade com o Netlify.
