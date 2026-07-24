import {
  ecoles as ecolesInit,
  chefs as chefsInit,
  utilisateurs as utilisateursInit,
  ordresMission as ordresInit,
  fichesControle as fichesInit,
  rapports as rapportsInit,
  decisions as decisionsInit,
  notifications as notificationsInit,
  journalActivite as journalInit,
  communes as communesInit,
  regimes as regimesInit,
  typesDecision as typesDecisionInit,
} from '../mock/index.js';
import { uid } from '../utils/helpers.js';

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function now() {
  return new Date().toISOString();
}

class AppStore {
  constructor() {
    this.listeners = new Set();
    this.currentUser = null;
    this.toasts = [];

    this.ecoles = clone(ecolesInit);
    this.chefs = clone(chefsInit);
    this.utilisateurs = clone(utilisateursInit);
    this.ordresMission = clone(ordresInit);
    this.fichesControle = clone(fichesInit);
    this.rapports = clone(rapportsInit);
    this.decisions = clone(decisionsInit);
    this.notifications = clone(notificationsInit);
    this.journalActivite = clone(journalInit);
    this.communes = clone(communesInit);
    this.regimes = clone(regimesInit);
    this.typesDecision = clone(typesDecisionInit);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this));
  }

  // Auth
  login(identifiant, motDePasse) {
    const user = this.utilisateurs.find(
      (u) => u.identifiant === identifiant && u.motDePasse === motDePasse && u.statut === 'actif'
    );
    if (!user) return { ok: false, error: 'Identifiants incorrects ou compte inactif/verrouillé.' };
    this.currentUser = user;
    this.addJournal('Authentification', 'connexion', `Connexion de ${user.nom}`);
    this.notify();
    return { ok: true, user };
  }

  logout() {
    if (this.currentUser) {
      this.addJournal('Authentification', 'déconnexion', `Déconnexion de ${this.currentUser.nom}`);
    }
    this.currentUser = null;
    this.notify();
  }

  switchRoleUser(userId) {
    const user = this.utilisateurs.find((u) => u.id === userId);
    if (user) {
      this.currentUser = user;
      this.notify();
    }
  }

  // Toast
  pushToast(message, type = 'success') {
    const id = uid('toast');
    this.toasts.push({ id, message, type });
    this.notify();
    setTimeout(() => {
      this.removeToast(id);
    }, 3500);
  }

  removeToast(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  // Journal & Notifications
  addJournal(module, action, detail) {
    const entry = {
      id: uid('log'),
      utilisateurId: this.currentUser?.id || 'systeme',
      module,
      action,
      detail,
      createdAt: now(),
    };
    this.journalActivite.unshift(entry);
    this.notify();
  }

  addNotification(payload) {
    const n = {
      id: uid('ntf'),
      lu: false,
      createdAt: now(),
      userId: this.currentUser?.id,
      ...payload,
    };
    this.notifications.unshift(n);
    this.notify();
  }

  markNotificationRead(id) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, lu: true } : n));
    this.notify();
  }

  markAllNotificationsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, lu: true }));
    this.notify();
  }

  // Écoles
  upsertEcole(data) {
    const exists = this.ecoles.some((e) => e.id === data.id);
    if (exists) {
      this.ecoles = this.ecoles.map((e) => (e.id === data.id ? { ...e, ...data, updatedAt: now() } : e));
      this.addJournal('Écoles', 'modification', `École ${data.denomination} modifiée`);
      this.pushToast('École mise à jour.');
    } else {
      const ecole = {
        ...data,
        id: uid('eco'),
        documents: data.documents || [],
        createdAt: now(),
        updatedAt: now(),
      };
      this.ecoles.unshift(ecole);
      this.addJournal('Écoles', 'création', `École ${ecole.denomination} créée`);
      this.pushToast('École créée.');
    }
  }

  deleteEcole(id) {
    const hasFiches = this.fichesControle.some((f) => f.ecoleId === id);
    const hasRapports = this.rapports.some((r) => r.ecoleId === id);
    if (hasFiches || hasRapports) {
      this.pushToast('Suppression impossible : des fiches ou rapports sont liés. Proposez une désactivation.', 'danger');
      return false;
    }
    const ecole = this.ecoles.find((e) => e.id === id);
    this.ecoles = this.ecoles.filter((e) => e.id !== id);
    this.addJournal('Écoles', 'suppression', `École ${ecole?.denomination} supprimée`);
    this.pushToast('École supprimée.');
    return true;
  }

  deactivateEcole(id) {
    this.ecoles = this.ecoles.map((e) =>
      e.id === id ? { ...e, statut: 'fermeture_temporaire', updatedAt: now() } : e
    );
    this.addJournal('Écoles', 'modification', `École ${id} désactivée`);
    this.pushToast('École désactivée (fermeture temporaire).');
  }

  // Chefs
  upsertChef(data) {
    const exists = this.chefs.some((c) => c.id === data.id);
    if (exists) {
      this.chefs = this.chefs.map((c) => (c.id === data.id ? { ...c, ...data } : c));
      this.pushToast('Chef d\'établissement mis à jour.');
      this.addJournal('Chefs', 'modification', `Chef ${data.nomComplet} modifié`);
    } else {
      const chef = { ...data, id: uid('chef'), createdAt: now() };
      this.chefs.unshift(chef);
      this.pushToast('Chef d\'établissement créé.');
      this.addJournal('Chefs', 'création', `Chef ${chef.nomComplet} créé`);
    }
  }

  deleteChef(id) {
    this.chefs = this.chefs.filter((c) => c.id !== id);
    this.pushToast('Chef d\'établissement supprimé.');
    this.addJournal('Chefs', 'suppression', `Chef ${id} supprimé`);
  }

  // Utilisateurs
  upsertUtilisateur(data) {
    const exists = this.utilisateurs.some((u) => u.id === data.id);
    if (exists) {
      this.utilisateurs = this.utilisateurs.map((u) => (u.id === data.id ? { ...u, ...data } : u));
      this.pushToast('Utilisateur mis à jour.');
      this.addJournal('Utilisateurs', 'modification', `Utilisateur ${data.nom} modifié`);
    } else {
      const user = {
        ...data,
        id: uid('usr'),
        motDePasse: data.motDePasse || 'changeme123',
        createdAt: now(),
      };
      this.utilisateurs.unshift(user);
      this.pushToast('Utilisateur créé.');
      this.addJournal('Utilisateurs', 'création', `Utilisateur ${user.nom} créé`);
    }
  }

  deleteUtilisateur(id) {
    this.utilisateurs = this.utilisateurs.filter((u) => u.id !== id);
    this.pushToast('Utilisateur supprimé.');
    this.addJournal('Utilisateurs', 'suppression', `Utilisateur ${id} supprimé`);
  }

  resetPassword(id) {
    this.utilisateurs = this.utilisateurs.map((u) =>
      u.id === id ? { ...u, motDePasse: 'Reset@123' } : u
    );
    this.pushToast('Mot de passe réinitialisé (simulé) : Reset@123');
    this.addJournal('Utilisateurs', 'réinitialisation', `Mot de passe réinitialisé pour ${id}`);
  }

  // Ordres
  upsertOrdre(data) {
    const exists = this.ordresMission.some((o) => o.id === data.id);
    if (exists) {
      this.ordresMission = this.ordresMission.map((o) => (o.id === data.id ? { ...o, ...data } : o));
      this.pushToast('Ordre de mission mis à jour.');
      this.addJournal('Ordres de mission', 'modification', `Ordre ${data.numero} modifié`);
    } else {
      const n = this.ordresMission.length + 1;
      const ordre = {
        ...data,
        id: uid('om'),
        numero: data.numero || `OM/PEK-MA/2024/${String(n).padStart(4, '0')}`,
        statut: data.statut || 'en_attente_signature',
        signePar: null,
        signeLe: null,
        createdAt: now(),
      };
      this.ordresMission.unshift(ordre);
      this.pushToast('Ordre de mission créé.');
      this.addJournal('Ordres de mission', 'création', `Ordre ${ordre.numero} créé`);
    }
  }

  deleteOrdre(id) {
    this.ordresMission = this.ordresMission.filter((o) => o.id !== id);
    this.pushToast('Ordre de mission supprimé.');
    this.addJournal('Ordres de mission', 'suppression', `Ordre ${id} supprimé`);
  }

  signerOrdre(id) {
    const user = this.currentUser;
    this.ordresMission = this.ordresMission.map((o) =>
      o.id === id ? { ...o, statut: 'signe', signePar: user?.id, signeLe: now() } : o
    );
    this.addNotification({
      type: 'signature',
      titre: 'Ordre de mission signé',
      message: `L'ordre ${id} a été signé.`,
    });
    this.pushToast('Ordre signé.');
    this.addJournal('Ordres de mission', 'signature', `Ordre ${id} signé`);
  }

  // Fiches
  upsertFiche(data) {
    const exists = this.fichesControle.some((f) => f.id === data.id);
    if (exists) {
      this.fichesControle = this.fichesControle.map((f) =>
        f.id === data.id ? { ...f, ...data, updatedAt: now() } : f
      );
      this.pushToast('Fiche de contrôle mise à jour.');
      this.addJournal('Fiches', 'modification', `Fiche ${data.numero || data.id} modifiée`);
    } else {
      const n = this.fichesControle.length + 1;
      const fiche = {
        ...data,
        id: uid('fc'),
        numero: `FC/2024/${String(n).padStart(4, '0')}`,
        statut: data.statut || 'brouillon',
        photos: data.photos || [],
        valideePar: null,
        valideeLe: null,
        createdAt: now(),
        updatedAt: now(),
      };
      this.fichesControle.unshift(fiche);
      this.pushToast('Fiche de contrôle créée.');
      this.addJournal('Fiches', 'création', `Fiche ${fiche.numero} créée`);
    }
  }

  deleteFiche(id) {
    this.fichesControle = this.fichesControle.filter((f) => f.id !== id);
    this.pushToast('Fiche supprimée.');
    this.addJournal('Fiches', 'suppression', `Fiche ${id} supprimée`);
  }

  validerFiche(id) {
    const user = this.currentUser;
    this.fichesControle = this.fichesControle.map((f) =>
      f.id === id ? { ...f, statut: 'validee', valideePar: user?.id, valideeLe: now(), updatedAt: now() } : f
    );
    this.addNotification({
      type: 'validation',
      titre: 'Fiche validée',
      message: `La fiche ${id} a été validée (Lu et approuvé).`,
    });
    this.pushToast('Fiche validée électroniquement.');
    this.addJournal('Fiches', 'validation', `Fiche ${id} validée`);
  }

  // Rapports
  upsertRapport(data) {
    const exists = this.rapports.some((r) => r.id === data.id);
    if (exists) {
      this.rapports = this.rapports.map((r) => (r.id === data.id ? { ...r, ...data } : r));
      this.pushToast('Rapport mis à jour.');
      this.addJournal('Rapports', 'modification', `Rapport ${data.numero || data.id} modifié`);
    } else {
      const n = this.rapports.length + 1;
      const rapport = {
        ...data,
        id: uid('rap'),
        numero: `RAP/PEK-MA/2024/${String(n).padStart(4, '0')}`,
        statut: data.statut || 'brouillon',
        deposeLe: null,
        deposePar: null,
        accuseReceptionLe: null,
        accusePar: null,
        transmisLe: null,
        createdAt: now(),
      };
      this.rapports.unshift(rapport);
      this.pushToast('Rapport créé.');
      this.addJournal('Rapports', 'création', `Rapport ${rapport.numero} créé`);
    }
  }

  deleteRapport(id) {
    this.rapports = this.rapports.filter((r) => r.id !== id);
    this.pushToast('Rapport supprimé.');
    this.addJournal('Rapports', 'suppression', `Rapport ${id} supprimé`);
  }

  deposerRapport(id) {
    const user = this.currentUser;
    this.rapports = this.rapports.map((r) =>
      r.id === id ? { ...r, statut: 'depose', deposeLe: now(), deposePar: user?.id } : r
    );
    this.addNotification({
      type: 'depot',
      titre: 'Rapport déposé',
      message: `Le rapport ${id} a été déposé au secrétariat.`,
    });
    this.pushToast('Rapport déposé au secrétariat.');
    this.addJournal('Rapports', 'dépôt', `Rapport ${id} déposé`);
  }

  delivrerAccuse(id) {
    const user = this.currentUser;
    this.rapports = this.rapports.map((r) =>
      r.id === id ? { ...r, statut: 'recu', accuseReceptionLe: now(), accusePar: user?.id } : r
    );
    this.pushToast('Accusé de réception délivré.');
    this.addJournal('Rapports', 'accusé', `Accusé délivré pour ${id}`);
  }

  transmettreRapport(id) {
    this.rapports = this.rapports.map((r) =>
      r.id === id ? { ...r, statut: 'transmis', transmisLe: now() } : r
    );
    this.addNotification({
      type: 'transmission',
      titre: 'Rapport transmis',
      message: `Le rapport ${id} a été transmis au Directeur Provincial.`,
    });
    this.pushToast('Rapport transmis au Directeur Provincial.');
    this.addJournal('Rapports', 'transmission', `Rapport ${id} transmis`);
  }

  // Décisions
  upsertDecision(data) {
    const exists = this.decisions.some((d) => d.id === data.id);
    const typeToStatut = {
      maintien: 'active',
      rehabilitation: 'rehabilitation',
      fermeture_temporaire: 'fermeture_temporaire',
      fermeture_definitive: 'fermeture_definitive',
    };

    if (exists) {
      this.decisions = this.decisions.map((d) => (d.id === data.id ? { ...d, ...data } : d));
      this.ecoles = this.ecoles.map((e) =>
        e.id === data.ecoleId ? { ...e, statut: typeToStatut[data.type] || e.statut, updatedAt: now() } : e
      );
      this.rapports = this.rapports.map((r) => (r.id === data.rapportId ? { ...r, statut: 'traite' } : r));
      this.pushToast('Décision mise à jour. Statut école synchronisé.');
      this.addJournal('Décisions', 'modification', `Décision ${data.numero || data.id} modifiée`);
    } else {
      const n = this.decisions.length + 1;
      const decision = {
        ...data,
        id: uid('dec'),
        numero: `DEC/2024/${String(n).padStart(4, '0')}`,
        decidePar: this.currentUser?.id,
        decideLe: now(),
        statutExecution: data.statutExecution || 'en_cours',
        createdAt: now(),
      };
      this.decisions.unshift(decision);
      this.ecoles = this.ecoles.map((e) =>
        e.id === decision.ecoleId ? { ...e, statut: typeToStatut[decision.type] || e.statut, updatedAt: now() } : e
      );
      this.rapports = this.rapports.map((r) => (r.id === decision.rapportId ? { ...r, statut: 'traite' } : r));
      this.addNotification({
        type: 'decision',
        titre: 'Nouvelle décision',
        message: `Décision ${decision.numero} enregistrée.`,
      });
      this.pushToast('Décision enregistrée. Statut de l\'école mis à jour.');
      this.addJournal('Décisions', 'création', `Décision ${decision.numero} créée`);
    }
  }

  deleteDecision(id) {
    this.decisions = this.decisions.filter((d) => d.id !== id);
    this.pushToast('Décision supprimée.');
    this.addJournal('Décisions', 'suppression', `Décision ${id} supprimée`);
  }

  // Référentiels
  upsertRef(key, item) {
    const list = this[key];
    const exists = list.some((x) => x.id === item.id);
    if (exists) {
      this[key] = list.map((x) => (x.id === item.id ? { ...x, ...item } : x));
      this.pushToast('Référence mise à jour.');
    } else {
      this[key] = [{ ...item, id: uid(key.slice(0, 3)), actif: true }, ...list];
      this.pushToast('Référence ajoutée.');
    }
    this.addJournal('Paramètres', exists ? 'modification' : 'création', `${key} mis à jour`);
    this.notify();
  }

  deleteRef(key, id) {
    this[key] = this[key].filter((x) => x.id !== id);
    this.pushToast('Référence supprimée.');
    this.addJournal('Paramètres', 'suppression', `${key} ${id} supprimé`);
    this.notify();
  }
}

export const appStore = new AppStore();
