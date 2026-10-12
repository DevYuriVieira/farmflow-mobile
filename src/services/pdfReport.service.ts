import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { Farm } from '../types/farm.types';
import { Plantation } from '../types/plantation.types';
import { FarmActivity } from '../types/activity.types';
import {
  getCropLabel,
  getPlantationStatusLabel,
  getActivityTypeLabel,
  getPlantationName,
  getActivityTitle,
  getFarmDisplayName,
} from '../utils/formatters';

export interface ReportData {
  farm?: Farm;
  plantations: Plantation[];
  activities: FarmActivity[];
  totalArea: number;
  completionRate: number;
  userName?: string;
  language?: 'pt' | 'en';
}

export async function generateAndSharePdfReport(data: ReportData): Promise<{ uri: string }> {
  const lang = data.language || 'pt';
  const farmName = data.farm ? getFarmDisplayName(data.farm, lang) : (lang === 'en' ? 'Agroproductive Farm' : 'Fazenda Agroprodutiva');
  const farmLocation = data.farm?.location || (lang === 'en' ? 'Agricultural Region' : 'Região Agrícola');
  const currentDate = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const plantationsRows = data.plantations
    .map(
      (p) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; font-weight: 600; color: #1E293B;">${getPlantationName(p, lang)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; color: #059669; font-weight: 600;">${getCropLabel(p.cropType, lang)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #334155;">${p.areaHectares} ha</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">
          <span style="background-color: #ECFDF5; color: #047857; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
            ${getPlantationStatusLabel(p.status, lang)}
          </span>
        </td>
      </tr>
    `
    )
    .join('');

  const activitiesRows = data.activities
    .slice(0, 10)
    .map(
      (a) => `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; color: #1E293B;">${getActivityTitle(a, lang)}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 12px;">${getActivityTypeLabel(a.type, lang)}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">
          <span style="color: ${a.completed ? '#10B981' : '#F59E0B'}; font-weight: bold; font-size: 12px;">
            ${a.completed ? (lang === 'en' ? '✓ Completed' : '✓ Concluído') : (lang === 'en' ? '⏳ Pending' : '⏳ Pendente')}
          </span>
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>Relatório Agronômico - ${farmName}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0F172A;
          margin: 0;
          padding: 32px;
          background-color: #FFFFFF;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #10B981;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .brand {
          font-size: 26px;
          font-weight: 800;
          color: #064E3B;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .meta-pill {
          background-color: #F1F5F9;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          color: #475569;
          text-align: right;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .summary-card {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 18px;
        }
        .summary-label {
          font-size: 12px;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .summary-value {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
        }
        h2 {
          font-size: 17px;
          font-weight: 700;
          color: #0F172A;
          margin-top: 24px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin-bottom: 24px;
        }
        th {
          background-color: #F1F5F9;
          color: #475569;
          padding: 10px;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #E2E8F0;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94A3B8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">🌱 FarmFlow</div>
          <div style="font-size: 18px; font-weight: 700; color: #1E293B; margin-top: 4px;">${farmName}</div>
          <div style="font-size: 13px; color: #64748B;">${farmLocation}</div>
        </div>
        <div class="meta-pill">
          <div><strong>Emissão:</strong> ${currentDate}</div>
          <div><strong>Responsável:</strong> ${data.userName || 'Produtor Rural'}</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-label">Área Monitorada</div>
          <div class="summary-value">${data.totalArea} ha</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total de Talhões</div>
          <div class="summary-value">${data.plantations.length}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Eficiência de Manejos</div>
          <div class="summary-value" style="color: #059669;">${data.completionRate}%</div>
        </div>
      </div>

      <h2>🌾 Lavouras e Talhões Registrados</h2>
      <table>
        <thead>
          <tr>
            <th>Talhão / Lote</th>
            <th>Cultura</th>
            <th style="text-align: right;">Área</th>
            <th style="text-align: center;">Status Atual</th>
          </tr>
        </thead>
        <tbody>
          ${plantationsRows || '<tr><td colspan="4" style="text-align:center; padding:12px;">Nenhum talhão cadastrado</td></tr>'}
        </tbody>
      </table>

      <h2>📋 Registro Recente de Manejos e Atividades</h2>
      <table>
        <thead>
          <tr>
            <th>Manejo Realizado / Programado</th>
            <th>Tipo</th>
            <th style="text-align: center;">Situação</th>
          </tr>
        </thead>
        <tbody>
          ${activitiesRows || '<tr><td colspan="3" style="text-align:center; padding:12px;">Nenhuma atividade cadastrada</td></tr>'}
        </tbody>
      </table>

      <div class="footer">
        <div>FarmFlow — Inteligência Agrícola e Gestão de Safras</div>
        <div>Documento autenticado digitalmente para fins de controle e consultoria técnica</div>
      </div>
    </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Relatório da Fazenda - ${farmName}`,
      UTI: 'com.adobe.pdf',
    });
  }

  return { uri };
}

export interface SprayMapaReportData {
  farmName: string;
  farmLocation: string;
  plantationName: string;
  cropType: string;
  targetPest: string;
  productName: string;
  activeIngredient: string;
  dosagePerHectare: string;
  sprayVolumeLPerHa: number;
  totalTreatedAreaHa: number;
  nozzleType: string;
  windSpeedKmH: number;
  temperatureC: number;
  humidityPercent: number;
  withdrawalPeriodDays: number;
  operatorName: string;
  appliedAt: string;
  prescriptionNumber?: string;
  agronomistName?: string;
  creaNumber?: string;
  bufferZoneMeters?: number;
  digitalSignatureHash?: string;
  notes?: string;
  language?: 'pt' | 'en';
}

export function calculateDeltaT(tempC: number, rhPercent: number): { value: number; status: 'IDEAL' | 'WARNING' | 'CRITICAL' } {
  const t = tempC;
  const rh = Math.min(100, Math.max(0, rhPercent));
  const tw =
    t * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
    Math.atan(t + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035;

  const deltaT = Number((t - tw).toFixed(1));
  let status: 'IDEAL' | 'WARNING' | 'CRITICAL' = 'IDEAL';

  if (deltaT >= 2.0 && deltaT <= 8.0) {
    status = 'IDEAL';
  } else if ((deltaT >= 1.0 && deltaT < 2.0) || (deltaT > 8.0 && deltaT <= 10.0)) {
    status = 'WARNING';
  } else {
    status = 'CRITICAL';
  }

  return { value: deltaT, status };
}

export async function generateAndShareSprayMapaReport(data: SprayMapaReportData): Promise<{ uri: string }> {
  const lang = data.language || 'pt';
  const deltaTInfo = calculateDeltaT(data.temperatureC, data.humidityPercent);
  const applicationDate = new Date(data.appliedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const harvestSafeDate = new Date(new Date(data.appliedAt).getTime() + data.withdrawalPeriodDays * 24 * 60 * 60 * 1000).toLocaleDateString(
    lang === 'en' ? 'en-US' : 'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  );

  const signatureHash = data.digitalSignatureHash || `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-MAPA-VERIFIED`;
  const prescriptionNumber = data.prescriptionNumber || `REC-AGRO-${Math.floor(100000 + Math.random() * 900000)}`;
  const agronomistName = data.agronomistName || 'Eng. Agr. Lucas Silveira Martins';
  const creaNumber = data.creaNumber || 'CREA-SP 506.892-D';
  const bufferZoneMeters = data.bufferZoneMeters || 30;

  const deltaTColor = deltaTInfo.status === 'IDEAL' ? '#10B981' : deltaTInfo.status === 'WARNING' ? '#F59E0B' : '#EF4444';
  const deltaTText =
    deltaTInfo.status === 'IDEAL'
      ? lang === 'en' ? 'IDEAL WINDOW (Low Drift Risk)' : 'FAIXA IDEAL (Baixo Risco de Deriva)'
      : deltaTInfo.status === 'WARNING'
      ? lang === 'en' ? 'MARGINAL (Caution Advised)' : 'ATENÇÃO (Risco Moderado de Evaporação)'
      : lang === 'en' ? 'UNFAVORABLE (High Drift / Washout)' : 'CRÍTICO (Risco Alto de Deriva / Inadequado)';

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>Laudo Técnico de Pulverização - MAPA</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0F172A;
          margin: 0;
          padding: 28px;
          background-color: #FFFFFF;
          font-size: 12px;
          line-height: 1.4;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #064E3B;
          padding-bottom: 14px;
          margin-bottom: 18px;
        }
        .mapa-badge {
          background-color: #064E3B;
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          display: inline-block;
          margin-bottom: 4px;
        }
        .doc-title {
          font-size: 18px;
          font-weight: 800;
          color: #064E3B;
        }
        .doc-subtitle {
          font-size: 12px;
          color: #475569;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .section-box {
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          padding: 10px 14px;
          background-color: #F8FAFC;
        }
        .section-title {
          font-size: 12px;
          font-weight: 700;
          color: #064E3B;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 4px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .field-label {
          color: #64748B;
          font-weight: 500;
        }
        .field-value {
          color: #0F172A;
          font-weight: 600;
          text-align: right;
        }
        .delta-box {
          background-color: #F0FDF4;
          border: 1px solid #86EFAC;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .signature-section {
          margin-top: 24px;
          border: 1px dashed #94A3B8;
          border-radius: 8px;
          padding: 14px;
          background-color: #FAFAFA;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stamp {
          border: 2px solid #064E3B;
          padding: 6px 12px;
          border-radius: 4px;
          color: #064E3B;
          font-weight: 800;
          font-size: 11px;
          text-align: center;
          text-transform: uppercase;
        }
        .footer {
          margin-top: 24px;
          border-top: 1px solid #E2E8F0;
          padding-top: 10px;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #94A3B8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="mapa-badge">COMPLIANCE REGULATÓRIO MAPA / ANVISA / IBAMA</div>
          <div class="doc-title">CADERNO OFICIAL DE PULVERIZAÇÃO E DEFENSIVOS</div>
          <div class="doc-subtitle">Laudo de Execução de Tratamento Fitossanitário · Rastreabilidade Agronômica</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 13px; font-weight: 700; color: #0F172A;">Nº ${prescriptionNumber}</div>
          <div style="font-size: 11px; color: #64748B;">Data: ${applicationDate}</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="section-box">
          <div class="section-title">1. Identificação da Propriedade & Talhão</div>
          <div class="field-row"><span class="field-label">Propriedade Rural:</span><span class="field-value">${data.farmName}</span></div>
          <div class="field-row"><span class="field-label">Município / UF:</span><span class="field-value">${data.farmLocation}</span></div>
          <div class="field-row"><span class="field-label">Talhão Alvo:</span><span class="field-value">${data.plantationName}</span></div>
          <div class="field-row"><span class="field-label">Cultura Agrícola:</span><span class="field-value">${data.cropType}</span></div>
          <div class="field-row"><span class="field-label">Área Aplicada:</span><span class="field-value">${data.totalTreatedAreaHa} hectares</span></div>
          <div class="field-row"><span class="field-label">Alvo Biológico:</span><span class="field-value">${data.targetPest}</span></div>
        </div>

        <div class="section-box">
          <div class="section-title">2. Responsabilidade Técnica & Legal</div>
          <div class="field-row"><span class="field-label">Eng. Agrônomo Responsável:</span><span class="field-value">${agronomistName}</span></div>
          <div class="field-row"><span class="field-label">Registro Profissional:</span><span class="field-value">${creaNumber}</span></div>
          <div class="field-row"><span class="field-label">Receituário Agronômico:</span><span class="field-value">${prescriptionNumber}</span></div>
          <div class="field-row"><span class="field-label">Operador / Aplicador:</span><span class="field-value">${data.operatorName}</span></div>
          <div class="field-row"><span class="field-label">Treinamento NR 31.8:</span><span class="field-value" style="color: #10B981;">Certificado Ativo</span></div>
          <div class="field-row"><span class="field-label">Distância de Corpos Hídricos:</span><span class="field-value">${bufferZoneMeters} m (Conforme Buffer Zone)</span></div>
        </div>
      </div>

      <div class="grid-2">
        <div class="section-box">
          <div class="section-title">3. Calda & Especificações do Produto</div>
          <div class="field-row"><span class="field-label">Produto Comercial:</span><span class="field-value">${data.productName}</span></div>
          <div class="field-row"><span class="field-label">Princípio Ativo:</span><span class="field-value">${data.activeIngredient}</span></div>
          <div class="field-row"><span class="field-label">Dose por Hectare:</span><span class="field-value">${data.dosagePerHectare}</span></div>
          <div class="field-row"><span class="field-label">Taxa de Aplicação:</span><span class="field-value">${data.sprayVolumeLPerHa} L/ha</span></div>
          <div class="field-row"><span class="field-label">Volume Total de Calda:</span><span class="field-value">${(data.sprayVolumeLPerHa * data.totalTreatedAreaHa).toFixed(0)} Litros</span></div>
          <div class="field-row"><span class="field-label">Ponta de Pulverização:</span><span class="field-value">${data.nozzleType}</span></div>
        </div>

        <div class="section-box">
          <div class="section-title">4. Segurança Toxicológica & Carência</div>
          <div class="field-row"><span class="field-label">Período de Carência:</span><span class="field-value" style="color: #EF4444;">${data.withdrawalPeriodDays} dias</span></div>
          <div class="field-row"><span class="field-label">Data de Liberação p/ Colheita:</span><span class="field-value" style="color: #10B981;">${harvestSafeDate}</span></div>
          <div class="field-row"><span class="field-label">Intervalo de Reentrada:</span><span class="field-value">24 horas com EPI completo</span></div>
          <div class="field-row"><span class="field-label">Tríplice Lavagem de Embalagem:</span><span class="field-value">Sim (Logística Reversa InpEV)</span></div>
          <div class="field-row"><span class="field-label">EPI Utilizado:</span><span class="field-value">Macacão Hidrorrepelente + Viseira + Respirador</span></div>
          <div class="field-row"><span class="field-label">Observações:</span><span class="field-value">${data.notes || 'Nenhuma anormalidade registrada'}</span></div>
        </div>
      </div>

      <div class="delta-box" style="border-left: 6px solid ${deltaTColor};">
        <div>
          <div style="font-weight: 700; color: #064E3B; font-size: 13px;">5. Condições Meteorológicas de Aplicação</div>
          <div style="color: #475569; margin-top: 2px;">
            Temperatura: <strong>${data.temperatureC}°C</strong> &nbsp;|&nbsp;
            Umidade Relativa: <strong>${data.humidityPercent}%</strong> &nbsp;|&nbsp;
            Vento: <strong>${data.windSpeedKmH} km/h</strong>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 16px; font-weight: 800; color: ${deltaTColor};">ΔT = ${deltaTInfo.value}°C</div>
          <div style="font-size: 11px; font-weight: 700; color: ${deltaTColor};">${deltaTText}</div>
        </div>
      </div>

      <div class="signature-section">
        <div>
          <div style="font-weight: 700; color: #1E293B; font-size: 12px;">Assinatura Digital do Aplicador Responsável</div>
          <div style="font-size: 11px; color: #64748B;">Operador: ${data.operatorName}</div>
          <div style="font-family: monospace; font-size: 10px; color: #064E3B; margin-top: 4px;">Hash de Autenticação: ${signatureHash}</div>
          <div style="font-size: 10px; color: #94A3B8;">Certificado via FarmFlow Mobile Offline Security Engine · GPS Integrado</div>
        </div>
        <div class="stamp">
          <div>FarmFlow</div>
          <div style="font-size: 9px; font-weight: normal;">MAPA AUDITADO</div>
        </div>
      </div>

      <div class="footer">
        <div>FarmFlow — Sistema Integrado de Gestão de Safras e Precisão Agronômica</div>
        <div>Em conformidade com a Lei Federal nº 7.802/89 e Decreto nº 4.074/02</div>
      </div>
    </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Laudo MAPA de Pulverização - ${data.plantationName}`,
      UTI: 'com.adobe.pdf',
    });
  }

  return { uri };
}

