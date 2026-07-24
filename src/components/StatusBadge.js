export function renderStatusBadgeHTML(map, value) {
  const label = map?.[value] || value || '—';
  const colorMap = {
    active: 'success',
    actif: 'success',
    validee: 'success',
    signe: 'success',
    executee: 'success',
    traite: 'success',
    rehabilitation: 'warning',
    en_cours: 'primary',
    en_attente_signature: 'warning',
    en_attente_validation: 'warning',
    brouillon: 'secondary',
    depose: 'info',
    recu: 'info',
    transmis: 'primary',
    fermeture_temporaire: 'warning',
    fermeture_definitive: 'danger',
    annule: 'danger',
    inactif: 'secondary',
    verrouille: 'danger',
    non_executee: 'danger',
    cloture: 'dark',
    maintien: 'success',
  };
  const color = colorMap[value] || 'secondary';
  return `<span class="badge bg-${color}-subtle text-${color}-emphasis">${label}</span>`;
}
