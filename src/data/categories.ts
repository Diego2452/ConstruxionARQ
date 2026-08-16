export const CATEGORIES = [
  'Residencia Unifamiliar',
  'Residencia Multifamiliar',
  'Oficinas y Comercios',
  'Institucional',
  'Otros',
  'Próximos y Diseños',
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_EN: Record<string, string> = {
  'Residencia Unifamiliar':  'Single-Family Residence',
  'Residencia Multifamiliar':'Multi-Family Residence',
  'Oficinas y Comercios':    'Offices & Commercial',
  'Institucional':           'Institutional',
  'Otros':                   'Other Projects',
  'Próximos y Diseños':      'Upcoming & Designs',
};
