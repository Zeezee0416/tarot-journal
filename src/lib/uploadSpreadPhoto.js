import { supabase } from './supabase.js';

export const BUCKET = 'case-photos';
export const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

const EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

export function spreadPhotoPath(userId, caseId, ext = 'jpg') {
  return `${userId}/${caseId}/spread.${ext}`;
}

export function validateSpreadPhoto(file) {
  if (!file) return '请选择照片';
  if (!ALLOWED.includes(file.type)) return '仅支持 JPG、PNG、WebP、HEIC 格式';
  if (file.size > MAX_SIZE) return '照片不能超过 5MB';
  return null;
}

export async function uploadSpreadPhoto(file, userId, caseId) {
  if (!supabase) throw new Error('Supabase 未配置');
  const err = validateSpreadPhoto(file);
  if (err) throw new Error(err);

  const ext = EXT[file.type] || 'jpg';
  const path = spreadPhotoPath(userId, caseId, ext);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

export async function deleteSpreadPhoto(path) {
  if (!supabase || !path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error('deleteSpreadPhoto:', error);
}

export async function getSpreadPhotoUrl(path) {
  if (!supabase || !path) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) {
    console.error('getSpreadPhotoUrl:', error);
    return null;
  }
  return data.signedUrl;
}

export async function getSpreadPhotoUrls(paths) {
  const entries = await Promise.all(
    paths.filter(Boolean).map(async (path) => [path, await getSpreadPhotoUrl(path)])
  );
  return Object.fromEntries(entries.filter(([, url]) => url));
}
