export function renderPageHeaderHTML({ title, subtitle, actionsHtml = '' }) {
  return `
    <div class="row mb-6 align-items-center">
      <div class="col-lg-8 col-md-7">
        <h1 class="mb-1 h2">${title}</h1>
        ${subtitle ? `<p class="mb-0 text-secondary">${subtitle}</p>` : ''}
      </div>
      ${actionsHtml ? `<div class="col-lg-4 col-md-5 text-md-end mt-3 mt-md-0">${actionsHtml}</div>` : ''}
    </div>
  `;
}
