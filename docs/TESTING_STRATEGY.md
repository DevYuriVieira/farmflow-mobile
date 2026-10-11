# 🧪 Estratégia Completa de Testes de Software — FarmFlow

Este documento descreve a arquitetura e a estratégia de garantia da qualidade (QA) do **FarmFlow**, estruturada conforme os padrões internacionais de engenharia de software (**ISTQB** e **ISO/IEC/IEEE 29119**), unificando as três ferramentas líderes da indústria: **Jest**, **Playwright** e **Cypress**.

---

## 🏗️ 1. Matriz de Ferramentas de Teste

| Ferramenta | Propósito Principal | Localização no Projeto |
| :--- | :--- | :--- |
| **Jest** | Unidade, Integração, Sistema, Aceitação, Regressão, Funcional, Não-Funcional, Caixa Branca e Caixa Preta | `__tests__/` |
| **Playwright** | E2E Moderno (Chromium, Mobile Emulation, Multi-page e visual traces) | `e2e/playwright/` |
| **Cypress** | E2E Browser Testing, interceptação e jornadas completas de usuário | `cypress/e2e/` |

---

## 📐 2. Níveis de Teste (ISO/IEC/IEEE 29119)

### 2.1. Teste de Unidade ou Componente (`__tests__/unit/`)
* **Framework**: Jest + TypeScript
* **Objetivo**: Validar o comportamento isolado de funções puras, utilitários, cálculos agronômicos atômicos, formatadores e componentes lógicos.
* **Escopo**:
  * Formatadores de datas brasileiras (`formatDatePtBr`, `formatTimePtBr`, `formatDateTimePtBr`).
  * Formatadores de medidas agrícolas (`formatHectares`, `formatPercentage`).
  * Dicionários e enums de domínio (`cropTypeLabels`, `plantationStatusLabels`, `activityTypeLabels`).
  * Internacionalização em runtime (`getTranslation` em PT-BR e EN).
  * Tokens e paletas de cores do Design System (`getThemeColors` para Light/Dark mode).
  * Tratamento de mensagens de erro amigáveis (`getFriendlyErrorMessage`).
  * Observabilidade em Produção, APM Spans e Resiliência de Fila Offline (`observability.test.ts`).

### 2.2. Teste de Integração (`__tests__/integration/`)
* **Framework**: Jest
* **Objetivo**: Verificar a comunicação e a integridade de dados entre múltiplos módulos e subsistemas desacoplados.
* **Escopo**:
  * Repositório de Fazendas integrado ao Repositório de Talhões e Atividades agrícolas.
  * Serviço de Autenticação integrado ao armazenamento local persistente (`sessionStorage`).
  * Integração entre cálculo de dimensionamento de calda (`calculateSpray`) e validação de janelas climáticas meteorológicas (`calculateDriftRisk`).

### 2.3. Teste de Sistema (`__tests__/system/`)
* **Framework**: Jest
* **Objetivo**: Validar o sistema completo de ponta a ponta (*End-to-End Simulation*), simulando o fluxo de trabalho real do produtor ou engenheiro agrônomo.
* **Escopo**:
  * Ciclo de Safra Completo:
    1. Autenticação do usuário.
    2. Cadastro da propriedade rural.
    3. Mapeamento e plantio dos talhões de produção.
    4. Dimensionamento e agendamento da operação de pulverização.
    5. Execução e conclusão da atividade em campo.
    6. Evolução fenológica e colheita do talhão.
    7. Fechamento financeiro da safra (apuração de receita bruta, custo total e lucro líquido por hectare).

### 2.4. Teste de Aceitação (`__tests__/acceptance/`)
* **Framework**: Jest (BDD: *Given / When / Then*)
* **Objetivo**: Validar os critérios de aceitação do negócio agronômico sob a ótica do usuário final.
* **Escopo**:
  * **Janela Segura de Pulverização (Risco de Deriva)**: Avaliação de condições climáticas adversas bloqueando operações de risco.
  * **Densidade Populacional e Produtividade**: Verificação de estande de plantas por hectare e estimativa de sacas por hectare.

---

## 🔬 3. Tipos e Metodologias de Teste

### 3.1. Testes de Confirmação (Reteste), Regressão e Manutenção (`__tests__/regression/`)
* **Teste de Confirmação (Reteste)**: Garante que defeitos previamente identificados foram efetivamente corrigidos (ex: prevenção de divisão por zero em pulverização com velocidade 0 km/h; regra de não aplicação de nitrogênio químico mineral em soja por simbiose biológica).
* **Teste de Regressão**: Assegura que novas funcionalidades ou limpezas de código não causaram efeitos colaterais em módulos estáveis.
* **Teste de Manutenção**: Valida a estabilidade de schemas Zod e preservação de tipos estritos durante manutenções contínuas.

### 3.2. Testes Funcionais (`__tests__/functional/`)
* **Objetivo**: Avaliar se as funções do software realizam exatamente o que foi especificado nos Requisitos Funcionais (RF).
* **Escopo**:
  * Cálculo exato do Ponto de Equilíbrio (*Break-Even Point*) em sacas/ha.
  * Catálogo fitossanitário com limiares de dano econômico (NDE).
  * Filtros dinâmicos de talhões por cultura e status.
  * Alternância de conclusão de manejos agrícolas.

### 3.3. Testes Não-Funcionais (`__tests__/non-functional/`)
* **Objetivo**: Avaliar aspectos de qualidade técnica como desempenho, conformidade de acessibilidade e robustez.
* **Escopo**:
  * **Performance / Benchmark**: Execução de 5.000 iterações de dimensionamento de calda em menos de 500ms.
  * **Acessibilidade e Contraste**: Garantia de contraste WCAG no Dark Mode e Light Mode.
  * **Imutabilidade**: Certificação de que objetos de entrada não sofrem mutação lateral durante cálculos matemáticos.

---

## 📦 4. Técnicas de Teste

### 4.1. Testes Caixa Preta (`__tests__/blackbox/`)
* **Abordagem**: Testes baseados estritamente na especificação de requisitos funcionais, sem inspeção do código interno.
* **Técnicas aplicadas**:
  * **Particionamento em Classes de Equivalência**: Divisão de parâmetros meteorológicos em classes válidas (ótimas) e inválidas (inversão térmica, vento forte, ar excessivamente seco).
  * **Análise de Valor Limite (BVA)**: Testes nos valores limítrofes exatos de transição de vento (7.0, 7.1, 10.0 e 10.1 km/h), umidade (55%, 50%) e temperatura (28°C, 30°C).

### 4.2. Testes Caixa Branca (`__tests__/whitebox/`)
* **Abordagem**: Testes estruturais baseados no conhecimento explícito do código-fonte e fluxo de controle.
* **Técnicas aplicadas**:
  * **Cobertura de Ramos (*Branch Coverage*)**: Teste de todos os caminhos dos `switch-cases` de adubação NPK (`SOY`, `CORN`, `COFFEE`, `COTTON`, `WHEAT`).
  * **Caminhos de Tratamento de Exceções**: Cobertura sistemática de todos os ramos de normalização de erros de rede e HTTP (401, 403, 404, 422, 500, timeout e erros inesperados) em `apiError.ts`.

---

## 🌐 5. Testes E2E (End-to-End) no Navegador

### 5.1. Playwright E2E (`e2e/playwright/`)
* **Configuração**: `playwright.config.ts`
* **Navegadores**: Chromium (Pixel 5 Mobile Emulation + Desktop Chrome).
* **Comando**: `npm run test:e2e:playwright` ou `npm run test:e2e:playwright:ui` (interface interativa).
* **Testes**: Validação do carregamento da aplicação web, viewport mobile, interação com simulação climática e verificação do DOM.

### 5.2. Cypress E2E (`cypress/e2e/`)
* **Configuração**: `cypress.config.ts`
* **Resolução**: Viewport mobile iPhone 14 (390 x 844 px).
* **Comando**: `npm run test:e2e:cypress` (headless) ou `npm run test:e2e:cypress:open` (App interativo).
* **Testes**: Visita interativa do dashboard agro, validação visual e capturas de tela automatizadas.

### 5.3. Testes de Regressão Visual Automatizados (`e2e/playwright/farmflow-visual-regression.spec.ts`)
* **Configuração**: Playwright com `toHaveScreenshot({ maxDiffPixelRatio: 0.05, animations: 'disabled' })`.
* **Comandos**:
  - `npm run test:visual`: Compara a renderização atual contra os snapshots dourados (*golden baselines*).
  - `npm run test:visual:update`: Atualiza os snapshots de baseline.
  - `npm run test:visual:cypress`: Executa capturas multi-viewport (mobile, tablet, desktop) no Cypress.
* **Documentação Detalhada**: Ver [`docs/VISUAL_REGRESSION_TESTING.md`](file:///c:/Users/Yuri/OneDrive/Desktop/Native/FarmFlow/docs/VISUAL_REGRESSION_TESTING.md).

---

## ⚡ 6. Scripts Disponíveis no `package.json`

```bash
# === Suíte Principal Jest ===
npm test                    # Executa as 16 suítes Jest (108 testes)
npm run test:unit           # Testes de Unidade, Componente e Observabilidade
npm run test:integration    # Testes de Integração
npm run test:system         # Testes de Sistema (E2E Domain)
npm run test:acceptance     # Testes de Aceitação (BDD)
npm run test:regression     # Confirmação, Regressão e Manutenção
npm run test:functional     # Testes Funcionais
npm run test:non-functional # Performance e Acessibilidade
npm run test:blackbox       # Caixa Preta (Equivalência & Limites)
npm run test:whitebox       # Caixa Branca (Estrutural & Ramos)
npm run test:coverage       # Gera relatório de cobertura em HTML/LCOV

# === Testes E2E & Regressão Visual no Navegador ===
npm run test:e2e            # Executa Playwright E2E
npm run test:e2e:playwright # Executa Playwright E2E
npm run test:e2e:cypress    # Executa Cypress E2E em modo headless
npm run test:e2e:cypress:open # Abre a interface gráfica do Cypress
npm run test:visual         # Executa Regressão Visual com Playwright
npm run test:visual:update  # Atualiza baselines visuais de comparação
npm run test:visual:cypress # Executa capturas multi-viewport no Cypress
```

---

## 🚀 7. Pipeline de CI/CD (GitHub Actions)

A automação de integração contínua em `.github/workflows/ci.yml` executa em cada `push` e `pull request` para a branch `main`:
1. `npx tsc --noEmit` (TypeScript strict mode)
2. `npm run lint` (ESLint)
3. `npm test -- --coverage --watchAll=false` (Jest Test Suite)
4. `npx expo-doctor` (Saúde do ambiente Expo SDK 54)
