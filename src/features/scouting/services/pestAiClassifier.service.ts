export interface PestDiagnosisResult {
  pestId: string;
  commonName: string;
  scientificName: string;
  cropType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidencePercent: number;
  symptoms: string[];
  activeIngredientRecommendation: string;
  recommendedDosagePerHectare: string;
  sprayVolumeLHa: string;
  gracePeriodDays: number;
  urgencyHours: number;
  agronomicNotes: string;
}

export const PEST_CATALOG: PestDiagnosisResult[] = [
  {
    pestId: 'pest_ferrugem_soja',
    commonName: 'Ferrugem Asiática da Soja',
    scientificName: 'Phakopsora pachyrhizi',
    cropType: 'Soja',
    severity: 'critical',
    confidencePercent: 94.2,
    symptoms: [
      'Pústulas amarronzadas na face abaxial das folhas',
      'Clorose foliar progressiva com desfolha precoce',
      'Pústulas erumpentes contendo urédios densos',
    ],
    activeIngredientRecommendation: 'Trifloxistrobina + Protioconazol + Mancozebe (Multissítio)',
    recommendedDosagePerHectare: '0.4 L/ha + 1.5 kg/ha',
    sprayVolumeLHa: '100 - 150 L/ha',
    gracePeriodDays: 21,
    urgencyHours: 24,
    agronomicNotes: 'Aplicar preventivamente ou no primeiro sinal de pústulas em estádio R1-R5. Adicionar óleo metilado de soja.',
  },
  {
    pestId: 'pest_lagarta_cartucho',
    commonName: 'Lagarta-do-Cartucho',
    scientificName: 'Spodoptera frugiperda',
    cropType: 'Milho',
    severity: 'high',
    confidencePercent: 91.8,
    symptoms: [
      'Folhas raspadas no cartucho com perfurações em forma de janela',
      'Excrementos serrilhados acumulados no interior do cartucho',
      'Corte de plântulas recém-emergidas rente ao solo',
    ],
    activeIngredientRecommendation: 'Clorantraniliprole ou Metomil ou Spinetoram',
    recommendedDosagePerHectare: '50 - 100 mL/ha',
    sprayVolumeLHa: '150 - 200 L/ha',
    gracePeriodDays: 14,
    urgencyHours: 48,
    agronomicNotes: 'Direcionar gotas ao cartucho com bicos cônicos de alta penetração no início da manhã ou entardecer.',
  },
  {
    pestId: 'pest_percevejo_marrom',
    commonName: 'Percevejo-Marrom',
    scientificName: 'Euschistus heros',
    cropType: 'Soja',
    severity: 'high',
    confidencePercent: 88.5,
    symptoms: [
      'Retenção foliar no final do ciclo (soja louca)',
      'Abortamento de vagens e chochamento de grãos',
      'Pontuações necróticas na semente reduzindo germinação',
    ],
    activeIngredientRecommendation: 'Acefato + Bifentrina + Dinotefuram',
    recommendedDosagePerHectare: '0.75 kg/ha + 0.2 L/ha',
    sprayVolumeLHa: '100 - 120 L/ha',
    gracePeriodDays: 20,
    urgencyHours: 48,
    agronomicNotes: 'Nível de controle: 2 percevejos/metro no pano de batida para grãos comerciais ou 1/metro para campos de semente.',
  },
  {
    pestId: 'pest_bicudo_algodao',
    commonName: 'Bicudo-do-Algodoeiro',
    scientificName: 'Anthonomus grandis',
    cropType: 'Algodão',
    severity: 'critical',
    confidencePercent: 95.0,
    symptoms: [
      'Botões florais com brácteas abertas e amareladas',
      'Perfurações de alimentação e oviposição nas maçãs',
      'Queda massiva de estruturas reprodutivas',
    ],
    activeIngredientRecommendation: 'Malationa ou Betaciflutrina',
    recommendedDosagePerHectare: '1.0 L/ha',
    sprayVolumeLHa: '120 - 150 L/ha',
    gracePeriodDays: 10,
    urgencyHours: 24,
    agronomicNotes: 'Praga quarentenária de controle compulsório. Aplicar nas bordaduras e monitorar armadilhas de feromônio bicudol.',
  },
  {
    pestId: 'pest_cercosporiose',
    commonName: 'Cercosporiose do Milho',
    scientificName: 'Cercospora zeae-maydis',
    cropType: 'Milho',
    severity: 'medium',
    confidencePercent: 86.4,
    symptoms: [
      'Manchas estreitas retangulares delimitadas pelas nervuras secundárias',
      'Coloração castanho-acinzentada com necrose foliar rápida',
      'Acamamento precoce de colmo',
    ],
    activeIngredientRecommendation: 'Azoxistrobina + Ciproconazol',
    recommendedDosagePerHectare: '0.3 L/ha',
    sprayVolumeLHa: '150 L/ha',
    gracePeriodDays: 30,
    urgencyHours: 72,
    agronomicNotes: 'Aplicar no pré-pendoamento (estádio V8-VT). Realizar rotação com híbridos geneticamente tolerantes.',
  },
  {
    pestId: 'pest_broca_cafe',
    commonName: 'Broca-do-Café',
    scientificName: 'Hypothenemus hampei',
    cropType: 'Café',
    severity: 'high',
    confidencePercent: 89.1,
    symptoms: [
      'Orifício circular na coroa dos frutos chumbinho e cereja',
      'Destruição interna dos grãos de café com perda de peso',
      'Depreciação severa da bebida (tipo e catação)',
    ],
    activeIngredientRecommendation: 'Ciantraniliprole ou Clorantraniliprole',
    recommendedDosagePerHectare: '1.5 L/ha',
    sprayVolumeLHa: '400 L/ha',
    gracePeriodDays: 14,
    urgencyHours: 48,
    agronomicNotes: 'Aplicar no trânsito da broca (após 90 dias da grande florada). Realizar colheita e repasse rigorosos no talhão.',
  },
  {
    pestId: 'pest_cigarrinha_milho',
    commonName: 'Cigarrinha-do-Milho',
    scientificName: 'Dalbulus maidis',
    cropType: 'Milho',
    severity: 'critical',
    confidencePercent: 93.7,
    symptoms: [
      'Enfezamento pálido e vermelho com estrias cloróticas',
      'Proliferação de espigas pequenas e improdutivas',
      'Transmissão de molicutes e vírus do raiado fino',
    ],
    activeIngredientRecommendation: 'Imidacloprido + Tiametoxam + Beauveria bassiana (Biológico)',
    recommendedDosagePerHectare: '0.25 L/ha + 1.0 kg/ha',
    sprayVolumeLHa: '120 L/ha',
    gracePeriodDays: 21,
    urgencyHours: 24,
    agronomicNotes: 'Controle imediato nos estádios iniciais (V1-V4). Eliminar milho tiguera nas áreas vizinhas.',
  },
];

export async function classifyPestImageAsync(
  imageUri?: string,
  preferredCrop = 'Soja'
): Promise<PestDiagnosisResult> {
  // If an image URI contains hints or file name
  if (imageUri) {
    const lower = imageUri.toLowerCase();
    if (lower.includes('milho') || lower.includes('cartucho')) {
      return PEST_CATALOG[1];
    }
    if (lower.includes('percevejo')) {
      return PEST_CATALOG[2];
    }
    if (lower.includes('algod') || lower.includes('bicudo')) {
      return PEST_CATALOG[3];
    }
    if (lower.includes('cercospora')) {
      return PEST_CATALOG[4];
    }
    if (lower.includes('cafe') || lower.includes('broca')) {
      return PEST_CATALOG[5];
    }
    if (lower.includes('cigarrinha')) {
      return PEST_CATALOG[6];
    }
  }

  // Filter or match by preferred crop
  const match = PEST_CATALOG.find(
    (p) => p.cropType.toLowerCase() === preferredCrop.toLowerCase()
  );

  return match || PEST_CATALOG[0];
}
