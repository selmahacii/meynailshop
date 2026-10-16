export function formatImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '/images/placeholder-product.png';
  }

  let trimmed = url.trim();

  // Handle JSON array or brackets e.g. ["url"] or ["url1", "url2"]
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        trimmed = String(parsed[0]).trim();
      } else {
        return '/images/placeholder-product.png';
      }
    } catch {
      trimmed = trimmed.replace(/^\[["']?/, '').replace(/["']?\]$/, '').trim();
    }
  }

  // Remove surrounding quotes e.g. "https://..." or 'https://...'
  trimmed = trimmed.replace(/^["']/, '').replace(/["']$/, '').trim();

  if (!trimmed || trimmed === '' || trimmed === '/images/placeholder-product.png') {
    return '/images/placeholder-product.png';
  }

  // If already an absolute http/https URL, return it
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If relative path without leading slash, e.g. "uploads/xyz.webp"
  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`;
  }

  // If starts with /uploads/ or /images/
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('/images/')) {
    return trimmed;
  }

  // If it's a raw filename like "xyz.webp"
  if (trimmed.endsWith('.webp') || trimmed.endsWith('.png') || trimmed.endsWith('.jpg') || trimmed.endsWith('.jpeg')) {
    return `/uploads/${trimmed}`;
  }

  return trimmed;
}
