/** Utilitaires Inspect-San */

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function paginate(items, page, pageSize) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    totalPages,
    page: current,
    pageSize,
  };
}

export function sortBy(items, key, dir = 'asc') {
  const sorted = [...items].sort((a, b) => {
    const va = a[key] ?? '';
    const vb = b[key] ?? '';
    if (typeof va === 'number' && typeof vb === 'number') return va - vb;
    return String(va).localeCompare(String(vb), 'fr', { sensitivity: 'base' });
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}

export function downloadText(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function openPrintPreview(title, htmlBody) {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html lang="fr"><head><title>${title}</title>
    <link rel="stylesheet" href="/assets/css/theme.min.css" />
    <style>body{padding:2rem;font-family:Public Sans,sans-serif} @media print{.no-print{display:none}}</style>
    </head><body>
    <div class="no-print mb-4"><button onclick="window.print()" class="btn btn-primary">Imprimer / PDF</button>
    <button onclick="window.close()" class="btn btn-outline-secondary ms-2">Fermer</button></div>
    ${htmlBody}</body></html>`);
  w.document.close();
}

export const ROLE_ACCESS = {
  'Administrateur système': [
    'dashboard', 'ecoles', 'chefs', 'utilisateurs', 'ordres', 'fiches',
    'rapports', 'accuses', 'decisions', 'statistiques', 'parametres', 'journal',
  ],
  'Directeur Provincial': [
    'dashboard', 'ordres', 'rapports', 'decisions', 'statistiques',
  ],
  'Contrôleur': [
    'dashboard', 'ordres', 'fiches', 'rapports',
  ],
  'Agent du Secrétariat': [
    'dashboard', 'rapports', 'accuses',
  ],
  "Chef d'établissement": [
    'dashboard', 'fiches', 'ecoles', 'decisions',
  ],
};

export function canAccess(role, pageKey) {
  return ROLE_ACCESS[role]?.includes(pageKey) ?? false;
}
