import { Share } from 'react-native';
import { Farm } from '../types/farm.types';
import { Plantation } from '../types/plantation.types';
import { FarmActivity } from '../types/activity.types';

export const shareService = {
  async shareFarm(farm: Farm): Promise<void> {
    try {
      const message = `🌿 *FarmFlow — Dados da Propriedade*
Fazenda: ${farm.name}
Localização: ${farm.location}
Área Total: ${farm.totalAreaHectares} hectares
Coordenadas: ${farm.coordinates.latitude.toFixed(4)}, ${farm.coordinates.longitude.toFixed(4)}
Gerenciado com o aplicativo FarmFlow.`;

      await Share.share({
        title: `FarmFlow — ${farm.name}`,
        message,
      });
    } catch (e) {
      console.warn('Erro ao compartilhar fazenda:', e);
    }
  },

  async sharePlantation(plantation: Plantation, farmName?: string): Promise<void> {
    try {
      const message = `🌱 *FarmFlow — Ficha do Talhão*
Talhão: ${plantation.name}
Cultura: ${plantation.cropType}
Área: ${plantation.areaHectares} ha
Status: ${plantation.status}
Fazenda: ${farmName || 'Propriedade cadastrada'}
Plantio: ${new Date(plantation.plantedAt).toLocaleDateString('pt-BR')}
Previsão Colheita: ${new Date(plantation.expectedHarvestAt).toLocaleDateString('pt-BR')}
${plantation.notes ? `Notas: ${plantation.notes}` : ''}
Gerenciado com o aplicativo FarmFlow.`;

      await Share.share({
        title: `FarmFlow — ${plantation.name}`,
        message,
      });
    } catch (e) {
      console.warn('Erro ao compartilhar talhão:', e);
    }
  },

  async shareActivity(activity: FarmActivity): Promise<void> {
    try {
      const message = `📋 *FarmFlow — Atividade Agrícola*
Título: ${activity.title}
Tipo: ${activity.type}
Data Agendada: ${new Date(activity.scheduledAt).toLocaleString('pt-BR')}
Status: ${activity.completed ? 'Concluída ✅' : 'Pendente ⏳'}
Descrição: ${activity.description}
Gerenciado com o aplicativo FarmFlow.`;

      await Share.share({
        title: `FarmFlow — ${activity.title}`,
        message,
      });
    } catch (e) {
      console.warn('Erro ao compartilhar atividade:', e);
    }
  },
};
