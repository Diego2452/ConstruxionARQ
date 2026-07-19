import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// ── Types ────────────────────────────────────────────────
export interface DBImage {
  id:          string;
  project_id:  string;
  src:         string;
  alt:         string;
  caption:     string | null;
  is_primary:  boolean;
  sort_order:  number;
  media_type?: 'image' | 'video';   // ← nuevo
}

export interface DBProject {
  id:             string;
  slug:           string;
  title:          string;
  location:       string | null;
  manager:        string | null;
  architect:      string | null;
  dimensions:     string | null;
  description:    string | null;
  year:           string | null;
  category:       string | null;
  created_at:     string;
  updated_at:     string;
  project_images?: DBImage[];
}

// ── Helpers ──────────────────────────────────────────────
function sortImages(imgs: DBImage[]): DBImage[] {
  return [...imgs].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
}

export async function getProjects(): Promise<DBProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .order('year', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(p => ({ ...p, project_images: sortImages(p.project_images ?? []) }));
}

export async function getProjectBySlug(slug: string): Promise<DBProject | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return { ...data, project_images: sortImages(data.project_images ?? []) };
}

export function getPrimaryImage(project: DBProject): DBImage | undefined {
  return project.project_images?.find(i => i.is_primary) ?? project.project_images?.[0];
}

// ── Detectar tipo de media por URL (fallback para datos viejos) ──
export function detectMediaType(url: string): 'image' | 'video' {
  if (/\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(url)) return 'video';
  return 'image';
}
