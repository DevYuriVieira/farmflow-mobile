import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { Farm } from '../types/farm.types';
import { Plantation } from '../types/plantation.types';
import { FarmActivity } from '../types/activity.types';
import { cropTypeLabels, plantationStatusLabels } from '../utils/formatters';

export interface ReportData {
  farm?: Farm;
  plantations: Plantation[];
  activities: FarmActivity[];
  totalArea: number;
  completionRate: number;
  userName?: string;
}

export async function generateAndSharePdfReport(data: ReportData): Promise<{ uri: string }> {
  const farmName = data.farm?.name || 'Fazenda Agroprodutiva';
  const farmLocation = data.farm?.location || 'Região Agrícola';
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const plantationsRows = data.plantations
    .map(
      (p) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; font-weight: 600; color: #1E293B;">${p.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; color: #059669; font-weight: 600;">${cropTypeLabels[p.cropType]}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #334155;">${p.areaHectares} ha</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">
          <span style="background-color: #ECFDF5; color: #047857; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
            ${plantationStatusLabels[p.status]}
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
        <td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; color: #1E293B;">${a.title}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 12px;">${a.type}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">
          <span style="color: ${a.completed ? '#10B981' : '#F59E0B'}; font-weight: bold; font-size: 12px;">
            ${a.completed ? '✓ Concluído' : '⏳ Pendente'}
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
