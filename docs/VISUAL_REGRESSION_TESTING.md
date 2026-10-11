# 👁️ Testes Automatizados de Regressão Visual — FarmFlow

Este documento descreve a infraestrutura de **Testes de Regressão Visual Automatizados** do **FarmFlow**, implementada para prevenir regressões de layout, quebra de componentes e inconsistências visuais em múltiplas resoluções (*Pixel-by-Pixel Visual Testing*).

---

## 🏗️ 1. Ferramental e Estratégia

| Camada | Ferramenta | Escopo | Tolerância |
| :--- | :--- | :--- | :--- |
| **Pixel Snapshot Testing** | **Playwright** | Mobile (Pixel 5) e Desktop (1280x720) | `maxDiffPixelRatio: 0.05` (5%) |
| **Multi-Viewport Snapshots** | **Cypress** | Mobile Portrait (390x844), Tablet (768x1024), Desktop (1280x800) | Captura estática com overwrite |
| **CI/CD Cloud Diffs** | **GitHub Actions** | Execução paralela em PRs com upload de imagens diff (`test-results/`) | Upload automático em falhas |

---

## 📐 2. Suítes de Regressão Visual Implementadas

### 2.1. Playwright Visual Comparison (`e2e/playwright/farmflow-visual-regression.spec.ts`)
* Validações:
  - `farmflow-landing-screen.png`: Comparação da tela inicial mobile e desktop contra os snapshots dourados (*golden baselines*).
  - `farmflow-root-container.png`: Comparação de renderização isolada do container raiz da aplicação.
* Tolerância e Estabilidade:
  - `animations: 'disabled'`: Pausa micro-animações CSS e Reanimated para evitar ruídos temporais durante a captura.
  - `maxDiffPixelRatio: 0.05`: Tolerância matemática de 5% para absorver diferenças de suavização de fontes (*anti-aliasing*) entre Linux/macOS/Windows.

### 2.2. Cypress Multi-Viewport Suite (`cypress/e2e/farmflow_visual_regression.cy.ts`)
* Captura sistemática em três viewports com dimensões exatas de dispositivos reais:
  1. `mobile-portrait`: 390 x 844 px (iPhone 14 / celulares modernos).
  2. `tablet`: 768 x 1024 px (iPad / tablets de campo).
  3. `desktop`: 1280 x 800 px (laptops de agrônomos e gestores de fazenda).

---

## ⚡ 3. Scripts no `package.json`

```bash
# Executa a suíte de regressão visual do Playwright contra o baseline
npm run test:visual

# Atualiza os snapshots dourados (usar após alterações intencionais de design)
npm run test:visual:update

# Executa as capturas multi-viewport no Cypress (headless)
npm run test:visual:cypress
```

---

## ☁️ 4. Integração Contínua e Integração em Nuvem (Percy / Chromatic)

### 4.1. GitHub Actions
No workflow `.github/workflows/ci.yml`:
* O job `visual-and-e2e` executa `npx playwright test` automaticamente.
* Caso haja regressão visual em algum pull request, os artefatos com as imagens `.diff.png`, `.actual.png` e `.expected.png` são enviados como artefatos de build para inspeção visual dos revisores.

### 4.2. Percy / Chromatic (Opcional para Nuvem Corporativa)
Para equipes que desejam aprovação visual em nuvem via dashboard do **Percy**:
```bash
npx percy exec -- npx playwright test
```
Configurando o token `PERCY_TOKEN` nas Secrets do GitHub Actions.
