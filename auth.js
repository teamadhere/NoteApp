// auth.js
// Authentication and user session logic

import { auth } from './firebase.js';
import { showModal } from './modal.js';

export let currentUser = null;

export function setupAuthHandlers() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userDropdown = document.getElementById('user-dropdown');
  const userAvatar = document.getElementById('user-avatar');


  loginBtn.onclick = (e) => {
    e.preventDefault();
    showLoginModal();
  };

  logoutBtn.onclick = () => auth.signOut();

  let loginModalInstance = null;
  function showLoginModal() {
    showModal({
      title: 'Sign in to NoteApp',
      body: `
        <div class="mb-3 text-center">
          <i class="bi bi-google" style="font-size:2.5rem; color:#4285F4;"></i>
        </div>
        <button id="modalLoginBtn" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2" style="font-size:1.1rem;">
          <i class="bi bi-google"></i> Sign in with Google
        </button>
      `,
      buttons: []
    });
    setTimeout(() => {
      // Store the Bootstrap modal instance for later closing
      loginModalInstance = bootstrap.Modal.getInstance(document.getElementById('reusableModal'));
      const modalLoginBtn = document.getElementById('modalLoginBtn');
      if (modalLoginBtn) {
        modalLoginBtn.onclick = () => {
          const provider = new firebase.auth.GoogleAuthProvider();
          auth.signInWithPopup(provider);
        };
      }
    }, 100);
  }
  function hideLoginModal() {
    // Hide the modal if it exists
    if (loginModalInstance) {
      loginModalInstance.hide();
      loginModalInstance = null;
    }
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      loginBtn.classList.add('d-none');
      if (userDropdown && userAvatar) {
        userAvatar.src = user.photoURL || '';
        userDropdown.style.display = 'block';
      }
      hideLoginModal();
    } else {
      currentUser = null;
      loginBtn.classList.remove('d-none');
      if (userDropdown && userAvatar) {
        userAvatar.src = '';
        userDropdown.style.display = 'none';
      }
      // No auto-popup on logout, just show login button
    }
  });
}
