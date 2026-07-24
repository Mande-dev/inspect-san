import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'src', 'mock');

const communes = [
  'Ngaba', 'Lemba', 'Limete', 'Matete', 'Kisenso', 'Makala', 'Kalamu',
  'Kasa-Vubu', 'Bandalungwa', 'Ngiri-Ngiri', 'Selembao', 'Mont-Ngafula',
];

const regimes = ['Public', 'Privé conventionné', 'Privé non conventionné', 'Confessionnel'];
const quartiers = [
  'Salongo', 'Righini', 'Livulu', 'Yolo', 'Matonge', 'Kinshasa', 'Camp Luka',
  'Masina', 'Ndjili', 'Bumbu', 'Binza', 'Kimbanseke',
];
const avenues = [
  'Avenue de l\'Université', 'Avenue By-Pass', 'Avenue Lumumba', 'Avenue de la Libération',
  'Avenue Kasa-Vubu', 'Avenue du Commerce', 'Avenue Tombalbaye', 'Avenue Wagenia',
  'Avenue de la Paix', 'Avenue Victoire', 'Avenue Huileries', 'Avenue Flambeau',
];

const prenoms = [
  'Jean', 'Marie', 'Patrick', 'Grace', 'Joseph', 'Thérèse', 'Pierre', 'Christine',
  'André', 'Véronique', 'François', 'Chantal', 'Michel', 'Ange', 'Dieu-Merci',
  'Espérance', 'Patient', 'Fiston', 'Nadine', 'Blaise', 'Aimée', 'Serge',
  'Mireille', 'Hervé', 'Carine', 'Yves', 'Odile', 'Célestin', 'Ruth', 'Emmanuel',
];

const noms = [
  'Mukendi', 'Kabongo', 'Ilunga', 'Tshibanda', 'Mwamba', 'Kalonji', 'Ngalula',
  'Kabasele', 'Lumbala', 'Mbuyi', 'Kasongo', 'Ndaya', 'Kabila', 'Tshisekedi',
  "d'Almeida", "O'Brien-Mukuna", 'Nzuzi', 'Banza', 'Kalala', 'Mputu',
  'Lukusa', 'Nsenga', 'Kanku', 'Mulamba', 'Cibangu', 'Wamba', 'Katanga',
];

const ecolePrefixes = [
  'École Primaire', 'Institut', 'Collège', 'Complexe Scolaire', 'Lycée',
  'Centre d\'Éducation', 'Groupe Scolaire', 'École Secondaire',
];

const ecoleNoms = [
  'Saint-Joseph', 'Notre-Dame', 'Patrice Lumumba', 'Kimpa Vita', 'Mandela',
  'de la Paix', 'Espoir', 'du Progrès', 'Sainte-Thérèse', 'Mwanga',
  'Kimbangu', 'de Mont-Amba', 'Avenir', 'Excellence', 'Réussite',
  'Bilingue Congolais', 'Technique Industriel', 'Commercial',
  "l'Alliance des Peuples pour l'Éducation Intégrale et le Développement Durable de Kinshasa",
  'Boboto', 'Salongo', 'Umoja', 'Liberté', 'Justice',
];

const roles = [
  'Administrateur système',
  'Directeur Provincial',
  'Contrôleur',
  'Agent du Secrétariat',
  'Chef d\'établissement',
];

const ecoleStatuts = ['active', 'rehabilitation', 'fermeture_temporaire', 'fermeture_definitive'];
const ordreStatuts = ['en_attente_signature', 'signe', 'en_cours', 'cloture', 'annule'];
const ficheStatuts = ['brouillon', 'en_attente_validation', 'validee'];
const rapportStatuts = ['brouillon', 'depose', 'recu', 'transmis', 'traite'];
const decisionTypes = ['maintien', 'rehabilitation', 'fermeture_temporaire', 'fermeture_definitive'];
const executionStatuts = ['en_cours', 'executee', 'non_executee'];
const userStatuts = ['actif', 'inactif', 'verrouille'];

function pad(n, w = 3) {
  return String(n).padStart(w, '0');
}

function pick(arr, i) {
  return arr[i % arr.length];
}

function dateISO(year, month, day, h = 8, m = 0) {
  return new Date(Date.UTC(year, month - 1, day, h, m)).toISOString();
}

function phone(i) {
  if (i % 7 === 0) return null;
  const base = 810000000 + (i * 137) % 89999999;
  return `+243${base}`;
}

function writeExport(filename, exportName, data) {
  const content = `/** Données fictives Inspect-San — ${exportName} */\nexport const ${exportName} = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(outDir, filename), content, 'utf8');
}

// --- Communes & régimes (références) ---
const communesRef = communes.map((nom, i) => ({
  id: `com-${pad(i + 1)}`,
  nom,
  actif: true,
}));

const regimesRef = regimes.map((nom, i) => ({
  id: `reg-${pad(i + 1)}`,
  nom,
  actif: true,
}));

const typesDecisionRef = decisionTypes.map((code, i) => ({
  id: `td-${pad(i + 1)}`,
  code,
  libelle: {
    maintien: 'Maintien',
    rehabilitation: 'Réhabilitation',
    fermeture_temporaire: 'Fermeture temporaire',
    fermeture_definitive: 'Fermeture définitive',
  }[code],
  actif: true,
}));

// --- Écoles (40+) ---
const ecoles = Array.from({ length: 42 }, (_, i) => {
  const n = i + 1;
  const statut = pick(ecoleStatuts, i);
  const longName = i === 18;
  return {
    id: `eco-${pad(n)}`,
    denomination: longName
      ? `${pick(ecolePrefixes, i)} ${pick(ecoleNoms, 18)}`
      : `${pick(ecolePrefixes, i)} ${pick(ecoleNoms, i)} ${i % 5 === 0 ? `n°${n}` : ''}`.trim(),
    regime: pick(regimes, i),
    idDinacope: `DIN-KIN-MA-${pad(n, 4)}`,
    numAgrement: i % 4 === 0 ? null : `AGR/${2020 + (i % 6)}/${pad(n)}`,
    numNotification: i % 5 === 0 ? null : `NOT/${2021 + (i % 5)}/${pad(n)}`,
    documents: i % 3 === 0
      ? []
      : [
          { nom: 'agrément.pdf', taille: '245 Ko', date: dateISO(2023, 3, 10) },
          ...(i % 2 === 0 ? [{ nom: 'notification.pdf', taille: '128 Ko', date: dateISO(2023, 5, 2) }] : []),
        ],
    adresse: {
      commune: pick(communes, i),
      quartier: pick(quartiers, i),
      avenue: pick(avenues, i),
      numero: String(10 + (i * 3) % 90),
    },
    statut,
    createdAt: dateISO(2022, 1 + (i % 12), 5 + (i % 20)),
    updatedAt: dateISO(2024, 1 + (i % 12), 8 + (i % 18)),
  };
});

// Cas filtre « aucun résultat » : aucune école avec régime + commune impossibles ensemble
// (filtrer régime Confessionnel + commune fictive "ZZZ-TEST" dans l'UI de démo)

// --- Chefs (60+) ---
const chefs = Array.from({ length: 62 }, (_, i) => {
  const n = i + 1;
  const sansEcole = i === 61;
  return {
    id: `chef-${pad(n)}`,
    nomComplet: `${pick(prenoms, i)} ${pick(noms, i + 3)}`,
    idDinacope: `DIN-CHEF-${pad(n, 4)}`,
    ancienneteEnseignement: 2 + (i % 28),
    ancienneteChef: i % 15,
    ancienneteEcole: i % 10,
    telephone: phone(i),
    ecoleId: sansEcole ? null : ecoles[i % ecoles.length].id,
    createdAt: dateISO(2021, 2 + (i % 10), 3 + (i % 25)),
  };
});

// --- Utilisateurs (15+) ---
const equipes = ['Équipe Alpha', 'Équipe Beta', 'Équipe Gamma', 'Équipe Delta'];

const utilisateursBase = [
  { nom: 'Admin Système', contact: 'admin@inspect-san.cd', role: roles[0], equipe: null, statut: 'actif', identifiant: 'admin', motDePasse: 'admin123' },
  { nom: 'Directeur Provincial Mukendi', contact: 'dp@inspect-san.cd', role: roles[1], equipe: null, statut: 'actif', identifiant: 'directeur', motDePasse: 'dir123' },
  { nom: 'Contrôleur Kabongo', contact: 'ctrl1@inspect-san.cd', role: roles[2], equipe: equipes[0], statut: 'actif', identifiant: 'controleur', motDePasse: 'ctrl123' },
  { nom: 'Contrôleur Ilunga', contact: 'ctrl2@inspect-san.cd', role: roles[2], equipe: equipes[0], statut: 'actif', identifiant: 'controleur2', motDePasse: 'ctrl123' },
  { nom: 'Contrôleur Tshibanda', contact: 'ctrl3@inspect-san.cd', role: roles[2], equipe: equipes[1], statut: 'actif', identifiant: 'controleur3', motDePasse: 'ctrl123' },
  { nom: 'Contrôleur Mwamba', contact: 'ctrl4@inspect-san.cd', role: roles[2], equipe: equipes[1], statut: 'inactif', identifiant: 'controleur4', motDePasse: 'ctrl123' },
  { nom: 'Contrôleur Kalonji', contact: 'ctrl5@inspect-san.cd', role: roles[2], equipe: equipes[2], statut: 'verrouille', identifiant: 'controleur5', motDePasse: 'ctrl123' },
  { nom: 'Agent Secrétariat Ngalula', contact: 'sec@inspect-san.cd', role: roles[3], equipe: null, statut: 'actif', identifiant: 'secretariat', motDePasse: 'sec123' },
  { nom: 'Agent Secrétariat Mbuyi', contact: 'sec2@inspect-san.cd', role: roles[3], equipe: null, statut: 'actif', identifiant: 'secretariat2', motDePasse: 'sec123' },
  { nom: 'Chef Établissement Marie Kabongo', contact: 'chef1@ecole.cd', role: roles[4], equipe: null, statut: 'actif', identifiant: 'chef', motDePasse: 'chef123', ecoleId: 'eco-001' },
  { nom: 'Chef Établissement Patrick Ilunga', contact: 'chef2@ecole.cd', role: roles[4], equipe: null, statut: 'actif', identifiant: 'chef2', motDePasse: 'chef123', ecoleId: 'eco-002' },
  { nom: 'Chef Établissement Grace Mwamba', contact: 'chef3@ecole.cd', role: roles[4], equipe: null, statut: 'inactif', identifiant: 'chef3', motDePasse: 'chef123', ecoleId: 'eco-003' },
  { nom: 'Superviseur Technique Banza', contact: 'super@inspect-san.cd', role: roles[0], equipe: null, statut: 'actif', identifiant: 'super', motDePasse: 'super123' },
  { nom: 'Directeur Adjoint Kalala', contact: 'dpa@inspect-san.cd', role: roles[1], equipe: null, statut: 'actif', identifiant: 'dpa', motDePasse: 'dpa123' },
  { nom: 'Contrôleur Senior Cibangu', contact: 'ctrl6@inspect-san.cd', role: roles[2], equipe: equipes[3], statut: 'actif', identifiant: 'controleur6', motDePasse: 'ctrl123' },
  { nom: 'Agent Archive Nsenga', contact: 'archive@inspect-san.cd', role: roles[3], equipe: null, statut: 'verrouille', identifiant: 'archive', motDePasse: 'arc123' },
];

const utilisateurs = utilisateursBase.map((u, i) => ({
  id: `usr-${pad(i + 1)}`,
  ...u,
  telephone: phone(i + 10),
  createdAt: dateISO(2022, 1 + (i % 12), 10),
}));

const controleurs = utilisateurs.filter((u) => u.role === 'Contrôleur' && u.statut === 'actif');

// --- Ordres de mission (50+) ---
const ordresMission = Array.from({ length: 52 }, (_, i) => {
  const n = i + 1;
  const statut = pick(ordreStatuts, i);
  const ecole = ecoles[i % ecoles.length];
  const nbCtrl = i === 5 ? 3 : 1 + (i % 2);
  const equipeIds = Array.from({ length: nbCtrl }, (_, k) => controleurs[(i + k) % controleurs.length].id);
  const emission = dateISO(2024 + Math.floor(i / 30), 1 + (i % 12), 1 + (i % 27), 9);
  return {
    id: `om-${pad(n)}`,
    numero: `OM/PEK-MA/2024/${pad(n, 4)}`,
    ecoleId: ecole.id,
    controleurIds: equipeIds,
    dateEmission: emission,
    validiteDebut: emission,
    validiteFin: dateISO(2024 + Math.floor(i / 30), 1 + ((i + 1) % 12), 15 + (i % 10), 17),
    statut,
    signePar: statut !== 'en_attente_signature' && statut !== 'annule' ? utilisateurs[1].id : null,
    signeLe: statut !== 'en_attente_signature' && statut !== 'annule' ? dateISO(2024, 1 + (i % 12), 2 + (i % 25), 14) : null,
    createdAt: emission,
  };
});

// --- Fiches de contrôle (70+) ---
const etatsBatiment = ['Bon', 'Moyen', 'Dégradé', 'Critique'];
const fichesControle = Array.from({ length: 72 }, (_, i) => {
  const n = i + 1;
  const ordre = ordresMission[i % ordresMission.length];
  // Prefer signed/en_cours orders for most fiches
  const ordreOk = ordresMission.find((o, idx) => idx >= i % 5 && ['signe', 'en_cours', 'cloture'].includes(o.statut)) || ordre;
  const ecoleId = i === 70 ? ecoles.find((e) => e.statut === 'fermeture_definitive').id : ordreOk.ecoleId;
  const chef = chefs.find((c) => c.ecoleId === ecoleId) || chefs[0];
  const statut = pick(ficheStatuts, i);
  const longObs = i === 12;
  const avecPhotos = i % 3 !== 0;
  return {
    id: `fc-${pad(n)}`,
    numero: `FC/2024/${pad(n, 4)}`,
    ordreMissionId: ordreOk.id,
    ecoleId,
    chefId: chef.id,
    statut,
    sectionBatiments: {
      nombreBatiments: 1 + (i % 8),
      etatGeneral: pick(etatsBatiment, i),
      toilettesFilles: 1 + (i % 6),
      toilettesGarcons: 1 + (i % 5),
      nombreEleves: 80 + (i * 17) % 900,
    },
    sectionImpact7: {
      montantPercu: 50000 + (i * 13000) % 500000,
      produitsNettoyage: i % 4 === 0 ? [] : ['Javel', 'Savon', 'Balais', 'Seaux'].slice(0, 1 + (i % 4)),
      quantite: `${10 + (i % 40)} unités`,
    },
    observations: longObs
      ? 'Observations détaillées : '.repeat(40) + "L'établissement présente des manquements majeurs en hygiène, assainissement et gestion des latrines. " +
        "Les recommandations portent sur la réhabilitation urgente des blocs sanitaires, l'approvisionnement régulier en produits de nettoyage financés par les 7 %, " +
        "la formation du personnel d'entretien et la mise en place d'un comité d'hygiène scolaire. " +
        "Un suivi rapproché est indispensable dans les 30 jours."
      : `Observation contrôle n°${n} : état général ${pick(etatsBatiment, i).toLowerCase()}.`,
    recommandationPreliminaire: pick(
      ['Maintien avec recommandations', 'Réhabilitation partielle', 'Fermeture temporaire proposée', 'Suivi renforcé'],
      i,
    ),
    photos: avecPhotos
      ? [
          { id: `ph-${n}-1`, nom: `toilettes_${n}.jpg`, url: '/assets/images/avatar/avatar-1.jpg' },
          ...(i % 2 === 0 ? [{ id: `ph-${n}-2`, nom: `cour_${n}.jpg`, url: '/assets/images/avatar/avatar-2.jpg' }] : []),
        ]
      : [],
    valideePar: statut === 'validee' ? utilisateurs.find((u) => u.role === "Chef d'établissement")?.id : null,
    valideeLe: statut === 'validee' ? dateISO(2024, 2 + (i % 10), 5 + (i % 20), 11) : null,
    createdAt: dateISO(2023 + Math.floor(i / 40), 1 + (i % 12), 3 + (i % 25)),
    updatedAt: dateISO(2024, 1 + (i % 12), 4 + (i % 20)),
  };
});

const fichesValidees = fichesControle.filter((f) => f.statut === 'validee');

// --- Rapports (40+) ---
const rapports = Array.from({ length: 42 }, (_, i) => {
  const n = i + 1;
  const statut = pick(rapportStatuts, i);
  const multi = i === 0;
  const ficheIds = multi
    ? fichesValidees.slice(0, 3).map((f) => f.id)
    : [fichesValidees[i % Math.max(fichesValidees.length, 1)]?.id || fichesControle[0].id];
  const ecoleId = fichesControle.find((f) => f.id === ficheIds[0])?.ecoleId || ecoles[0].id;
  return {
    id: `rap-${pad(n)}`,
    numero: `RAP/PEK-MA/2024/${pad(n, 4)}`,
    ficheIds,
    ecoleId,
    synthese: `Synthèse d'inspection n°${n} portant sur ${ficheIds.length} fiche(s) de contrôle. Conformité partielle observée.`,
    statut,
    deposeLe: ['depose', 'recu', 'transmis', 'traite'].includes(statut) ? dateISO(2024, 3 + (i % 8), 5, 10) : null,
    deposePar: ['depose', 'recu', 'transmis', 'traite'].includes(statut) ? controleurs[i % controleurs.length].id : null,
    accuseReceptionLe: ['recu', 'transmis', 'traite'].includes(statut) ? dateISO(2024, 3 + (i % 8), 6, 14) : null,
    accusePar: ['recu', 'transmis', 'traite'].includes(statut) ? utilisateurs.find((u) => u.role === 'Agent du Secrétariat')?.id : null,
    transmisLe: ['transmis', 'traite'].includes(statut) ? dateISO(2024, 3 + (i % 8), 7, 9) : null,
    createdAt: dateISO(2024, 2 + (i % 10), 1 + (i % 20)),
  };
});

// --- Décisions (40+) ---
const rapportsTraites = rapports.filter((r) => ['transmis', 'traite'].includes(r.statut));
const decisions = Array.from({ length: 40 }, (_, i) => {
  const n = i + 1;
  const rapport = rapportsTraites[i % Math.max(rapportsTraites.length, 1)] || rapports[0];
  const type = pick(decisionTypes, i);
  const statutExecution = pick(executionStatuts, i);
  return {
    id: `dec-${pad(n)}`,
    numero: `DEC/2024/${pad(n, 4)}`,
    rapportId: rapport.id,
    ecoleId: rapport.ecoleId,
    type,
    delaiExecution: `${7 + (i % 4) * 7} jours`,
    commentaire: `Décision ${type.replace(/_/g, ' ')} suite au rapport ${rapport.numero}.`,
    statutExecution,
    decidePar: utilisateurs[1].id,
    decideLe: dateISO(2024, 4 + (i % 8), 2 + (i % 20), 15),
    createdAt: dateISO(2024, 4 + (i % 8), 1 + (i % 20)),
  };
});

// --- Notifications (30+) ---
const notifTypes = ['signature', 'depot', 'decision', 'alerte', 'validation', 'transmission'];
const notifications = Array.from({ length: 32 }, (_, i) => {
  const n = i + 1;
  const type = pick(notifTypes, i);
  return {
    id: `ntf-${pad(n)}`,
    type,
    titre: {
      signature: 'Ordre de mission signé',
      depot: 'Rapport déposé au secrétariat',
      decision: 'Nouvelle décision prise',
      alerte: 'Alerte de conformité',
      validation: 'Fiche de contrôle validée',
      transmission: 'Rapport transmis au Directeur Provincial',
    }[type],
    message: `Notification automatique n°${n} — événement « ${type} » simulé dans Inspect-San.`,
    lu: i % 3 === 0,
    userId: utilisateurs[i % utilisateurs.length].id,
    createdAt: dateISO(2024, 5 + (i % 6), 1 + (i % 27), 8 + (i % 10)),
  };
});

// --- Journal d'activité ---
const modules = ['Écoles', 'Chefs', 'Utilisateurs', 'Ordres de mission', 'Fiches', 'Rapports', 'Décisions', 'Paramètres'];
const actions = ['création', 'modification', 'suppression', 'consultation', 'signature', 'validation', 'dépôt', 'transmission'];
const journalActivite = Array.from({ length: 80 }, (_, i) => ({
  id: `log-${pad(i + 1)}`,
  utilisateurId: utilisateurs[i % utilisateurs.length].id,
  module: pick(modules, i),
  action: pick(actions, i),
  detail: `${pick(actions, i)} sur ${pick(modules, i)} — enregistrement #${i + 1}`,
  createdAt: dateISO(2024, 1 + (i % 12), 1 + (i % 27), 7 + (i % 12), i % 60),
}));

// Write files
fs.mkdirSync(outDir, { recursive: true });
writeExport('communes.js', 'communes', communesRef);
writeExport('regimes.js', 'regimes', regimesRef);
writeExport('typesDecision.js', 'typesDecision', typesDecisionRef);
writeExport('ecoles.js', 'ecoles', ecoles);
writeExport('chefs.js', 'chefs', chefs);
writeExport('utilisateurs.js', 'utilisateurs', utilisateurs);
writeExport('ordresMission.js', 'ordresMission', ordresMission);
writeExport('fichesControle.js', 'fichesControle', fichesControle);
writeExport('rapports.js', 'rapports', rapports);
writeExport('decisions.js', 'decisions', decisions);
writeExport('notifications.js', 'notifications', notifications);
writeExport('journalActivite.js', 'journalActivite', journalActivite);
writeExport('equipes.js', 'equipes', equipes.map((nom, i) => ({ id: `eq-${pad(i + 1)}`, nom })));
writeExport('constantes.js', 'ROLES', roles);
writeExport('constantes.js', 'ECOLE_STATUTS', {
  active: 'Active',
  rehabilitation: 'Réhabilitation',
  fermeture_temporaire: 'Fermeture temporaire',
  fermeture_definitive: 'Fermeture définitive',
});

// Fix constantes — write properly as multi-export
fs.writeFileSync(
  path.join(outDir, 'constantes.js'),
  `export const ROLES = ${JSON.stringify(roles, null, 2)};

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
`,
  'utf8',
);

fs.writeFileSync(
  path.join(outDir, 'index.js'),
  `export { communes } from './communes.js';
export { regimes } from './regimes.js';
export { typesDecision } from './typesDecision.js';
export { ecoles } from './ecoles.js';
export { chefs } from './chefs.js';
export { utilisateurs } from './utilisateurs.js';
export { ordresMission } from './ordresMission.js';
export { fichesControle } from './fichesControle.js';
export { rapports } from './rapports.js';
export { decisions } from './decisions.js';
export { notifications } from './notifications.js';
export { journalActivite } from './journalActivite.js';
export { equipes } from './equipes.js';
export * from './constantes.js';
`,
  'utf8',
);

console.log('Mock data générées dans', outDir);
console.log({
  ecoles: ecoles.length,
  chefs: chefs.length,
  utilisateurs: utilisateurs.length,
  ordres: ordresMission.length,
  fiches: fichesControle.length,
  rapports: rapports.length,
  decisions: decisions.length,
  notifications: notifications.length,
});
