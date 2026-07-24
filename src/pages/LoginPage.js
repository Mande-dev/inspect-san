import { appStore } from '../store/appStore.js';
import { renderThemeSwitcherHTML, initThemeSwitcherListeners } from '../components/ThemeSwitcher.js';
import { renderModalHTML, openModal, closeModal } from '../components/Modal.js';
import { renderAppLogoHTML } from '../components/AppLogo.js';

export function renderLoginPage() {
  const forgotModalHtml = renderModalHTML({
    id: 'forgotModal',
    title: 'Mot de passe oublié',
    size: 'md',
    contentHtml: `
      <p>
        En environnement de démonstration, contactez l'administrateur système pour
        réinitialiser votre mot de passe. Aucun e-mail n'est envoyé (front-end uniquement).
      </p>
    `,
    footerHtml: `
      <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
        Compris
      </button>
    `,
  });

  return `
    <main class="d-flex flex-column justify-content-center vh-100 position-relative">
      <div class="position-absolute top-0 end-0 p-3">
        <ul class="list-unstyled mb-0">
          ${renderThemeSwitcherHTML()}
        </ul>
      </div>
      <section>
        <div class="container">
          <div class="row mb-8">
            <div class="col-xl-4 offset-xl-4 col-md-12 col-12">
              <div class="text-center">
                ${renderAppLogoHTML({ variant: 'login', className: 'justify-content-center mb-6' })}
                <h1 class="mb-1">Connexion</h1>
                <p class="mb-0 text-secondary">
                  Contrôle sanitaire — Province Éducationnelle de Kinshasa/Mont-Amba
                </p>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 col-12">
              <div class="card card-lg mb-6">
                <div class="card-body p-6">
                  <form id="loginForm" class="mb-4">
                    <div class="mb-3">
                      <label for="identifiant" class="form-label">
                        Identifiant <span class="text-danger">*</span>
                      </label>
                      <input
                        id="identifiant"
                        class="form-control"
                        value="admin"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="password" class="form-label">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        id="password"
                        class="form-control"
                        value="admin123"
                        required
                      />
                    </div>
                    <div id="loginErrorAlert" class="alert alert-danger py-2 d-none"></div>
                    <div class="mb-4 d-flex align-items-center justify-content-between">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember" />
                        <label class="form-check-label" for="remember">
                          Se souvenir de moi
                        </label>
                      </div>
                      <button
                        type="button"
                        class="btn btn-link p-0 text-primary"
                        id="forgotPasswordBtn"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div class="d-grid">
                      <button class="btn btn-primary" type="submit">
                        Se connecter
                      </button>
                    </div>
                  </form>
                  <div class="border-top pt-4">
                    <p class="small text-secondary mb-2">Comptes de démonstration :</p>
                    <ul class="small text-secondary mb-0">
                      <li>admin / admin123 (Administrateur)</li>
                      <li>directeur / dir123 (Directeur Provincial)</li>
                      <li>controleur / ctrl123 (Contrôleur)</li>
                      <li>secretariat / sec123 (Secrétariat)</li>
                      <li>chef / chef123 (Chef d'établissement)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${forgotModalHtml}
    </main>
  `;
}

export function initLoginPageEvents(container) {
  if (!container) return;
  initThemeSwitcherListeners(container);

  const form = container.querySelector('#loginForm');
  const errorEl = container.querySelector('#loginErrorAlert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifiant = container.querySelector('#identifiant').value.trim();
      const motDePasse = container.querySelector('#password').value;

      const res = appStore.login(identifiant, motDePasse);
      if (!res.ok) {
        errorEl.textContent = res.error;
        errorEl.classList.remove('d-none');
        appStore.pushToast(res.error, 'danger');
        return;
      }
      errorEl.classList.add('d-none');
      appStore.pushToast(`Bienvenue, ${res.user.nom}`);
      window.location.hash = '#/';
    });
  }

  const forgotBtn = container.querySelector('#forgotPasswordBtn');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => {
      openModal('forgotModal');
    });
  }
}
