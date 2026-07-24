export const ROLES = [
  "Administrateur système",
  "Directeur Provincial",
  "Contrôleur",
  "Agent du Secrétariat",
  "Chef d'établissement"
];

export const ECOLE_STATUTS = {
  active: 'Active',
  rehabilitation: 'Réhabilitation',
  fermeture_temporaire: 'Fermeture temporaire',
  fermeture_definitive: 'Fermeture définitive',
};

export const ORDRE_STATUTS = {
  en_attente_signature: 'En attente de signature',
  signe: 'Signé',
  en_cours: 'En cours',
  cloture: 'Clôturé',
  annule: 'Annulé',
};

export const FICHE_STATUTS = {
  brouillon: 'Brouillon',
  en_attente_validation: 'En attente de validation',
  validee: 'Validée (Lu et approuvé)',
};

export const RAPPORT_STATUTS = {
  brouillon: 'Brouillon',
  depose: 'Déposé',
  recu: 'Reçu',
  transmis: 'Transmis',
  traite: 'Traité',
};

export const DECISION_TYPES = {
  maintien: 'Maintien',
  rehabilitation: 'Réhabilitation',
  fermeture_temporaire: 'Fermeture temporaire',
  fermeture_definitive: 'Fermeture définitive',
};

export const EXECUTION_STATUTS = {
  en_cours: 'En cours',
  executee: 'Exécutée',
  non_executee: 'Non exécutée',
};

export const USER_STATUTS = {
  actif: 'Actif',
  inactif: 'Inactif',
  verrouille: 'Verrouillé',
};

export const PAGE_SIZE = 10;

/** Filtre démo pour état vide : commune inexistante */
export const FILTRE_AUCUN_RESULTAT = { commune: 'ZZZ-TEST', regime: 'Confessionnel' };
