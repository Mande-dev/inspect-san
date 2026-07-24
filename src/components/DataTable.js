import { PAGE_SIZE } from '../mock/constantes.js';
import { paginate, sortBy } from '../utils/helpers.js';
import { renderPaginationHTML } from './Pagination.js';

export function renderDataTable({
  columns,
  rows,
  searchKeys = [],
  searchPlaceholder = 'Rechercher…',
  filtersHtml = '',
  emptyMessage = 'Aucun enregistrement trouvé.',
  toolbarHtml = '',
  q = '',
  page = 1,
  sortKey = null,
  sortDir = 'asc',
}) {
  let filtered = rows;
  if (q.trim() && searchKeys.length) {
    const needle = q.trim().toLowerCase();
    filtered = filtered.filter((row) =>
      searchKeys.some((k) => String(typeof k === 'function' ? k(row) : row[k] ?? '').toLowerCase().includes(needle))
    );
  }
  if (sortKey) {
    filtered = sortBy(filtered, sortKey, sortDir);
  }

  const { items, total, totalPages, page: current } = paginate(filtered, page, PAGE_SIZE);

  const tableHeaderHtml = columns
    .map((col) => {
      const isSorted = sortKey === (col.sortKey || col.key);
      const icon = isSorted ? `<i class="ti ti-arrow-${sortDir === 'asc' ? 'up' : 'down'} ms-1"></i>` : '';
      if (col.sortable) {
        return `
          <th>
            <button
              type="button"
              class="btn btn-link btn-sm p-0 text-decoration-none text-body"
              data-sort-key="${col.sortKey || col.key}"
            >
              ${col.header}
              ${icon}
            </button>
          </th>
        `;
      }
      return `<th>${col.header}</th>`;
    })
    .join('');

  const tableBodyHtml =
    items.length === 0
      ? `
        <tr>
          <td colSpan="${columns.length}" class="text-center text-secondary py-5">
            ${emptyMessage}
          </td>
        </tr>
      `
      : items
          .map(
            (row) => `
        <tr data-id="${row.id}">
          ${columns
            .map((col) => `<td>${col.render ? col.render(row) : row[col.key] ?? '—'}</td>`)
            .join('')}
        </tr>
      `
          )
          .join('');

  const paginationHtml = renderPaginationHTML({
    page: current,
    totalPages,
    total,
    pageSize: PAGE_SIZE,
  });

  return `
    <div class="card">
      <div class="card-header border-bottom-0">
        <div class="row g-3 align-items-center">
          <div class="col-md-4">
            <input
              type="search"
              class="form-control datatable-search"
              placeholder="${searchPlaceholder}"
              value="${q}"
            />
          </div>
          ${filtersHtml ? `<div class="col-md-8">${filtersHtml}</div>` : ''}
        </div>
        ${toolbarHtml ? `<div class="mt-3">${toolbarHtml}</div>` : ''}
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0 text-nowrap">
            <thead class="table-light">
              <tr>
                ${tableHeaderHtml}
              </tr>
            </thead>
            <tbody>
              ${tableBodyHtml}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer">
        ${paginationHtml}
      </div>
    </div>
  `;
}

export function initDataTableEvents(container, { onSearch, onPageChange, onSortChange, onActionClick }) {
  if (!container) return;

  const searchInput = container.querySelector('.datatable-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      onSearch(e.target.value);
    });
  }

  const sortButtons = container.querySelectorAll('[data-sort-key]');
  sortButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      onSortChange(btn.getAttribute('data-sort-key'));
    });
  });

  const pageButtons = container.querySelectorAll('.page-link[data-page]');
  pageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pageVal = parseInt(btn.getAttribute('data-page'), 10);
      if (!isNaN(pageVal)) onPageChange(pageVal);
    });
  });

  if (onActionClick) {
    container.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-action');
        const id = btn.getAttribute('data-id');
        onActionClick(action, id, btn, e);
      });
    });
  }
}
