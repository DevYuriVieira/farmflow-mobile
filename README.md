# 🌱 FarmFlow — Gestão Agrícola de Alta Performance

FarmFlow é um aplicativo mobile completo para gestão de fazendas, talhões, culturas agrícolas e manejos agronômicos operacionais. Desenvolvido em **React Native** com **Expo** e **TypeScript Strict**, possui uma identidade visual única inspirada em paisagens agrícolas profundas, com uma assinatura de **fundo animado em camadas**, componentes com estética frosted glass dark green e arquitetura de nível corporativo.

---

## 🎨 Identidade Visual & Design System

Inspirado no visual de ponta da agricultura digital sustentável e monitoramento agronômico:
- **Cores Naturais e Tons Profundos**: Paleta verde floresta escuro (`#07150E`, `#11291D`), verde esmeralda vibrante (`#22C55E`, `#4ADE80`), broto/lima (`#A3E635`) e âmbar dourado de colheita (`#EAB308`).
- **Cards Frosted Glass**: Superfícies translúcidas com bordas finas e iluminação sutil inspiradas na interface do FarmFlow.
- **Assinatura Fundo Agrícola Animado (`AnimatedFarmBackground`)**:
  - Céu atmosférico de neblina matinal com suave brilho solar.
  - Colinas e cristas distantes com silhueta de pinheiros e floresta.
  - Curvas de nível e terraços agrícolas ondulantes com linhas de plantio.
  - Camada de névoa respiratória e nuvens em deslocamento horizontal suave contínuo.
  - Silhueta de brotos/gramíneas em primeiro plano com suave oscilação ao vento via React Native Animated API (`useNativeDriver: true`).
  - Suporte completo a redução de movimento (`reducedMotion`) configurável nas preferências.
- **Dock de Navegação Inferior Flutuante**: Barra em formato de cápsula escura com botões circulares e atalho rápido para leitor de QR Code.

---

## 🏗️ Arquitetura do Software

O projeto segue arquitetura modular orientada a funcionalidades (**Feature-Driven Architecture**):

```
farmflow/
  src/
    app/                    # Provedores globais (React Query, Toast, Auth, Preferences)
    components/             # Componentes de UI reutilizáveis (Button, TextField, Modal, Cards, Screen)
    config/                 # Configuração de variáveis de ambiente tipadas (env.ts)
    contexts/               # Gerenciamento de estado global (AuthContext, ToastContext, PreferencesContext)
    features/
      auth/                 # Telas de Splash, Login, Cadastro e esquemas Zod
      dashboard/            # Painel com clima, sugestões agronômicas, métricas e checklist
      farms/                # CRUD completo de fazendas e propriedades rurais
      plantations/          # CRUD completo de talhões, culturas e registro fotográfico
      activities/           # CRUD de atividades, agendamento de manejos e lembretes
      calendar/             # Agenda agrícola semanal
      maps/                 # Mapeamento espacial das propriedades
      qr/                   # Scanner e gerador de QR Code para placas de talhões
      reports/              # Relatórios de produtividade e distribuição de culturas
      settings/             # Perfil, preferências do app, conectividade e reset do mock
    hooks/                  # Hooks customizados (useNetworkStatus, useDebounce)
    mocks/                  # Banco de dados simulado assíncrono com persistência local e dados semente
    navigation/             # Tipagem estrita de rotas, Root Stack, Auth Stack, Drawer e Main Tabs
    repositories/           # Contratos de repositório e seleções Mock vs HTTP
    services/               # Serviços de API, Axios, erros normalizados, notificações e compartilhamento
    storage/                # Persistência segura (SecureStore) e preferências (AsyncStorage)
    theme/                  # Tokens de cores, espaçamentos, tipografia, raios e animações
    types/                  # Entidades de domínio e contratos tipados (TypeScript Strict)
    utils/                  # Formatadores pt-BR de datas, hectares e tratamento de erros
  __tests__/                # Suíte de testes automatizados com Jest
```

---

## ⚡ Tecnologias Utilizadas

- **Expo SDK 54** + **React Native 0.81**
- **TypeScript 5.9** em Modo Estrito (100% TS/TSX, sem nenhum `any` no código do app)
- **React Navigation 7** (Native Stack, Drawer Navigator, Bottom Tabs)
- **TanStack Query v5** (Cache, mutações e invalidação automática)
- **React Hook Form** + **Zod** (Validação de formulários com mensagens em pt-BR)
- **Axios** (Cliente HTTP centralizado com interceptors e normalização de erros)
- **Expo SecureStore** (Armazenamento seguro de tokens de sessão)
- **AsyncStorage** (Persistência local de preferências e banco mock)
- **Expo ImagePicker** (Fotografia de talhões via Câmera e Galeria de Fotos)
- **Expo Notifications** (Agendamento de lembretes locais para manejos e irrigações)
- **React Native SVG** (Ilustração vetorial e curvas do terreno agrícola)
- **React Native QRCode SVG** (Geração de QR codes para identificação dos lotes)
- **NetInfo** (Monitoramento de conexão e banner de modo offline)
- **React Native Animated API** (Animações de entrada, transições e fundo dinâmico)
- **Jest & ts-jest** (Testes unitários automatizados)

---

## 🔑 Credenciais de Demonstração (Mock Mode)

O aplicativo funciona imediatamente sem depender de backends externos:

- **E-mail**: `demo@farmflow.ag`
- **Senha**: `123456`

*(A tela de login possui um atalho para preenchimento instantâneo das credenciais de demonstração).*

---

## 🚀 Como Executar o Projeto

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento Expo
```bash
npx expo start
```
- Pressione `a` para rodar no emulador Android
- Pressione `i` para rodar no simulador iOS
- Pressione `w` para rodar no navegador Web

### 3. Validação de Tipos (TypeScript Strict)
```bash
npm run typecheck
```

### 4. Executar Testes Automatizados
```bash
npm test
```

---

## 📱 Funcionalidades Implementadas

1. **Autenticação & Sessão**:
   - Tela de Splash animada com restauração de sessão em segundo plano.
   - Login e Cadastro com validação Zod e atalho de demonstração.
   - Navegação protegida que impede acesso a rotas privadas antes da autenticação.
   - Limpeza automática de cache privado ao encerrar sessão.

2. **Dashboard Agrícola**:
   - Cartão meteorológico com temperatura em destaque, probabilidade de chuva e sensação térmica.
   - Cartão de sugestões do dia (reprodução fiel do card da referência visual).
   - Métricas de hectares cultivados e equipe operacional no campo.
   - Checklist interativo de tarefas do dia com alternância de status instantânea.

3. **Gestão de Talhões (Plantations)**:
   - Listagem com FlatList, busca em tempo real com debounce e filtros de estágio.
   - Modal nativo (`AppModal`) para criação e edição de talhões.
   - Integração com **Câmera** e **Galeria** para fotos da lavoura.
   - Ficha técnica completa do talhão com atalho para QR Code, compartilhamento nativo e exclusão com confirmação.

4. **Gestão de Fazendas (Farms)**:
   - Cadastro e edição de propriedades rurais com área e geolocalização.
   - Seleção da fazenda ativa atual nas preferências.
   - Ficha com resumo de talhões vinculados e dados georreferenciados.

5. **Manejos & Atividades (Activities)**:
   - Agendamento de irrigações, adubações, colheitas e pulverizações.
   - Agendamento automático de notificações locais para lembrar o produtor.
   - Marcação rápida de conclusão.

6. **Mapeamento Espacial (Maps)**:
   - Radar e visualizador espacial agrícola das propriedades com coordenadas GPS.
   - Seleção de marcadores e acesso direto à ficha da propriedade.

7. **Leitor e Gerador de QR Code**:
   - Leitor com mira visual animada e validação de lotes.
   - Gerador de QR Code para impressão e identificação física dos talhões na fazenda.

8. **Agenda Agrícola (Calendar)**:
   - Carrossel com agenda dos próximos 7 dias e listagem das atividades diárias.
   - Preparado para sincronização com Google Agenda.

9. **Modo Offline & Resiliência**:
   - Detecção em tempo real do estado da rede via NetInfo com exibição de banner.
   - Banco mock com persistência local em AsyncStorage sobrevivendo a reinicializações.

---

## ⚙️ Variáveis de Ambiente (.env)

Consulte o arquivo `.env.example`:
```env
EXPO_PUBLIC_API_URL=https://api.farmflow.ag/v1
EXPO_PUBLIC_USE_MOCK_API=true
EXPO_PUBLIC_API_TIMEOUT_MS=10000
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=
EXPO_PUBLIC_MAPS_API_KEY=
```
