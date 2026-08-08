export const CATEGORIES = [
  'Residencia Unifamiliar',
  'Residencia Multifamiliar',
  'Residencial — Otros',
  'Oficinas',
  'Comercio',
  'Institucional',
  'Proyectos Varios',
  'Próximos y Diseños',
] as const;

export const CATEGORY_EN: Record<string, string> = {
  'Residencia Unifamiliar':   'Single-Family Residence',
  'Residencia Multifamiliar': 'Multi-Family Residence',
  'Residencial — Otros':      'Residential — Other',
  'Oficinas':                 'Offices',
  'Comercio':                 'Commercial',
  'Institucional':            'Institutional',
  'Proyectos Varios':         'Various Projects',
  'Próximos y Diseños':       'Upcoming & Designs',
};