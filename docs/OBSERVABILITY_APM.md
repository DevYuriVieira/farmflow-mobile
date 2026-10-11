# 📡 Observabilidade em Produção, APM & Crash Reporting — FarmFlow

Este documento descreve a arquitetura de **Observabilidade e Monitoramento de Performance de Aplicações (APM)** do **FarmFlow**, projetada especificamente para ambientes móveis e rurais de alta criticidade (*AgTech*).

---

## 🏗️ 1. Pilares da Arquitetura

```
+--------------------------------------------------------------------------+
|                           FarmFlow UI / React Native                     |
|                                                                          |
|  [ErrorBoundary] -----> [AuthContext] -----> [HTTP Interceptors]         |
+---------+--------------------+-----------------------+-------------------+
          |                    |                       |
          v                    v                       v
+--------------------------------------------------------------------------+
|                  observabilityService (Singleton Engine)                 |
|                                                                          |
|  * Rolling Breadcrumbs Buffer (50 items, FIFO)                           |
|  * User Context (id, email, farmId)                                      |
|  * APM Spans (startSpan, measureAsync, durationMs)                       |
|  * Offline Resilient Event Queue (Auto-flush upon reconnection)          |
+------------------------------------+-------------------------------------+
                                     |
                                     v
+--------------------------------------------------------------------------+
|                     IObservabilityTransport Adapter                      |
|                                                                          |
|   [Console / Local DEV]   |   [Sentry Mobile SDK]   |   [DataDog APM]   |
+--------------------------------------------------------------------------+
```

---

## 🔬 2. Componentes e Responsabilidades

### 2.1. `ObservabilityService` (`src/services/observability/observability.service.ts`)
* **Buffer Circular de Breadcrumbs**: Armazena as últimas 50 ações (navegação, chamadas HTTP, interações de usuário e transições de sistema) sem sobrecarregar a memória do dispositivo.
* **Contexto de Sessão e Usuário**: Vincula dados de autenticação (`id`, `email`) a todos os eventos capturados, limpando-os automaticamente no logout.
* **APM Spans & Medição de Latência**:
  ```typescript
  // Medição atômica de cálculo agronômico
  const span = observabilityService.startSpan('spray_calibration', 'agronomy.math');
  // ... cálculos ...
  await span.finish('ok');

  // Helper assíncrono com captura automática de erro
  const result = await observabilityService.measureAsync(
    'sync_plantations',
    'network.sync',
    () => syncPlantations()
  );
  ```

### 2.2. Resiliência Offline em Campo
Em operações rurais remotas, a conectividade é intermitente. O serviço:
1. Detecta o status de rede via `@react-native-community/netinfo` em `useOfflineSync`.
2. Se offline, retém falhas e exceções em uma **fila local de eventos pendentes**.
3. Ao restabelecer a conexão (`setNetworkStatus(true)`), realiza o **auto-flush** de todos os incidentes pendentes para o transport configurado.

### 2.3. Componente `ErrorBoundary` (`src/components/ErrorBoundary.tsx`)
* Envolve a árvore de componentes no ponto de entrada (`App.tsx`).
* Captura falhas inesperadas de renderização (`componentDidCatch`).
* Dispara um evento com severidade `fatal` e `componentStack` detalhado.
* Exibe uma tela de recuperação com estética visual integrada ao Design System do FarmFlow, botão de retentativa e código do incidente para suporte.

### 2.4. Rastreamento HTTP via Interceptors (`src/services/api.ts`)
* Registra breadcrumbs para cada requisição disparada (`GET`, `POST`, etc.).
* Registra breadcrumbs de resposta com status code e latência.
* Erros de servidor (5xx) e falhas críticas de infraestrutura são automaticamente reportados ao serviço de observabilidade.

---

## 🚀 3. Conectando Sentry ou DataDog em Produção

O serviço implementa a interface `IObservabilityTransport`:

```typescript
export interface IObservabilityTransport {
  name: string;
  sendEvent(event: ObservabilityEvent): Promise<void>;
  sendBreadcrumb(breadcrumb: Breadcrumb): void;
  sendSpan(span: PerformanceSpan): Promise<void>;
}
```

Para conectar o **Sentry** em produção:
1. Adicione a variável de ambiente `EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project` no `.env`.
2. Instale o SDK compatível: `npx expo install @sentry/react-native`.
3. Registre o transport no startup (`index.ts` ou `App.tsx`):

```typescript
import * as Sentry from '@sentry/react-native';
import { observabilityService } from './src/services/observability/observability.service';

if (ENV.sentryDsn) {
  Sentry.init({
    dsn: ENV.sentryDsn,
    environment: ENV.environment,
  });

  observabilityService.setTransport({
    name: 'sentry-transport',
    sendEvent: async (evt) => {
      Sentry.captureException(new Error(evt.errorMessage), {
        level: evt.level,
        tags: evt.tags,
        extra: evt.extra,
      });
    },
    sendBreadcrumb: (b) => {
      Sentry.addBreadcrumb({ message: b.message, category: b.type, data: b.data });
    },
    sendSpan: async (span) => {
      // Sentry performance span instrumentation
    },
  });
}
```

---

## 🧪 4. Suíte de Testes Automatizados

A suíte em `__tests__/unit/observability.test.ts` cobre:
* Captura de erros com instâncias `Error` e strings brutas com metadados.
* Limite circular (FIFO) do buffer de breadcrumbs.
* Associação e desassociação de contexto do usuário no ciclo de vida de autenticação.
* Medição de duração de spans de APM e tratamento de erros no `measureAsync`.
* Enfileiramento offline e auto-flush no restabelecimento de rede.

Comando para execução:
```bash
npm test -- __tests__/unit/observability.test.ts
```
