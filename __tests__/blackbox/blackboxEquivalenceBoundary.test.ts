import { calculateDriftRisk } from '../../src/features/spraying/sprayFormulas';

describe('8. Testes Caixa Preta (Black Box: Equivalence Partitioning & Boundary Value Analysis)', () => {
  describe('Particionamento de Classes de Equivalência (Equivalence Partitioning)', () => {
    test('Classe Válida [Risco Baixo]: Vento brando (<= 7 km/h), umidade alta (>= 55%) e temperatura amena (<= 28°C)', () => {
      const risk = calculateDriftRisk(5, 65, 24);
      expect(risk).toBe('LOW');
    });

    test('Classe Intermediária [Risco Moderado]: Vento entre 7 e 10 km/h ou umidade entre 50 e 55%', () => {
      const risk = calculateDriftRisk(9, 60, 26);
      expect(risk).toBe('MODERATE');
    });

    test('Classe Crítica [Risco Alto]: Vento acima de 10 km/h, umidade abaixo de 50% ou temperatura acima de 30°C', () => {
      const riskWind = calculateDriftRisk(12, 60, 24);
      expect(riskWind).toBe('HIGH');

      const riskHumidity = calculateDriftRisk(6, 45, 24);
      expect(riskHumidity).toBe('HIGH');

      const riskTemp = calculateDriftRisk(6, 60, 33);
      expect(riskTemp).toBe('HIGH');
    });
  });

  describe('Análise de Valor Limite (Boundary Value Analysis - BVA)', () => {
    test('Limites de Vento: Testando transições exatas em 7 km/h e 10 km/h', () => {
      expect(calculateDriftRisk(7.0, 60, 25)).toBe('LOW');
      expect(calculateDriftRisk(7.1, 60, 25)).toBe('MODERATE');
      expect(calculateDriftRisk(10.0, 60, 25)).toBe('MODERATE');
      expect(calculateDriftRisk(10.1, 60, 25)).toBe('HIGH');
    });

    test('Limites de Umidade Relativa: Testando transições exatas em 55% e 50%', () => {
      expect(calculateDriftRisk(5, 55, 25)).toBe('LOW');
      expect(calculateDriftRisk(5, 54.9, 25)).toBe('MODERATE');
      expect(calculateDriftRisk(5, 50.0, 25)).toBe('MODERATE');
      expect(calculateDriftRisk(5, 49.9, 25)).toBe('HIGH');
    });

    test('Limites de Temperatura: Testando transições exatas em 28°C e 30°C', () => {
      expect(calculateDriftRisk(5, 60, 28.0)).toBe('LOW');
      expect(calculateDriftRisk(5, 60, 28.1)).toBe('MODERATE');
      expect(calculateDriftRisk(5, 60, 30.0)).toBe('MODERATE');
      expect(calculateDriftRisk(5, 60, 30.1)).toBe('HIGH');
    });
  });
});
