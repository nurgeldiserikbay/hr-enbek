export const LEGAL_DOCUMENTS_MOCK: unknown = [
  {
    id: 'laws',
    title: 'Законы',
    icon: 'scale',
    documents: [
      {
        id: 'labour-code',
        title: 'Трудовой кодекс Республики Казахстан',
        description: 'Основной закон, регулирующий трудовые отношения',
        url: 'https://adilet.zan.kz/rus/docs/K1500000414',
        pdfUrl: '/mock/documents/labour-code.pdf',
      },
    ],
  },
  {
    id: 'rules',
    title: 'Правила',
    icon: 'gavel',
    documents: [
      {
        id: 'contract-information-rules',
        title: 'Правила предоставления сведений о трудовом договоре',
        description: 'Порядок внесения сведений о трудовых договорах в ЕСУТД',
        url: 'https://adilet.zan.kz/rus/docs/V2000021335',
        pdfUrl: '/mock/documents/contract-information-rules.pdf',
      },
      {
        id: 'professional-payment-rules',
        title: 'Правила осуществления профессиональной выплаты',
        description: 'Условия и порядок назначения выплаты',
        url: 'https://adilet.zan.kz/rus/docs/V2300032787',
        pdfUrl: '/mock/documents/professional-payment-rules.pdf',
      },
    ],
  },
  {
    id: 'recommendations',
    title: 'Методические рекомендации',
    icon: 'book-open',
    documents: [
      {
        id: 'accident-insurance',
        title: 'Методические рекомендации по страхованию работников от несчастных случаев',
        description: 'Для работодателей и специалистов по охране труда',
        url: 'https://www.enbek.gov.kz',
        pdfUrl: '/mock/documents/accident-insurance.pdf',
      },
    ],
  },
];
