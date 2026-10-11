export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertCategory =
  | 'WEATHER_RISK'
  | 'SOIL_MOISTURE'
  | 'PEST_DISEASE'
  | 'CHEMICAL_EXPIRATION';

export interface FarmAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  farmId: string;
  isRead: boolean;
  createdAt: string;
  actionRoute?: string;
  actionParams?: Record<string, unknown>;
}
