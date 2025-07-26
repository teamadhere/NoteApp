// modal.js
// Utility for showing a reusable Bootstrap modal

export function showModal({ title = '', body = '', buttons = [] }) {
    // Remove any existing modal
    const modalContainer = document.getElementById('dynamicModal');
    modalContainer.innerHTML = '';

    // Build buttons HTML
    const buttonsHtml = buttons.map((btn, i) =>
        `<button type="button" class="btn ${btn.class || 'btn-secondary'}" id="modalBtn${i}">${btn.text}</button>`
    ).join(' ');

    // Modal HTML
    const modalHtml = `
    <div class="modal fade" id="reusableModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">${body}</div>
          <div class="modal-footer">${buttonsHtml}</div>
        </div>
      </div>
    </div>`;

    modalContainer.innerHTML = modalHtml;

    // Show modal using Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('reusableModal'));
    modal.show();

    // Attach button callbacks
    buttons.forEach((btn, i) => {
        const el = document.getElementById(`modalBtn${i}`);
        if (el && typeof btn.onClick === 'function') {
            el.onclick = (e) => {
                btn.onClick(e, modal);
            };
        }
    });
}
