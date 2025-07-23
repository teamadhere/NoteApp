console.log("WELCOME TO NOTEAPP! GREETING FROM TEAM ADHERE");

// --- Firebase config --- (MOVE THIS TO THE TOP)
const firebaseConfig = {
  apiKey: "AIzaSyAyfsonnOU2zsmoZsbyEgA6X7cB9iwtCb8",
  authDomain: "notesapp-a8f31.firebaseapp.com",
  projectId: "notesapp-a8f31",
  storageBucket: "notesapp-a8f31.firebasestorage.app",
  messagingSenderId: "184190884818",
  appId: "1:184190884818:web:a86c86b795909bb313860b",
  measurementId: "G-VETZF2K6F3"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null; // Initialize before use
showNotes();
let inputPinned = false;
function toggleInputPin() {
    const pinBtn = document.getElementById('pinBtn');
    if (pinBtn) {
        pinBtn.classList.toggle('active');
    }
}

// If user adds a note, add it to the localStorage
// Removed Add Note button logic since we're auto-saving

// Update showNotes function
function showNotes() {
  if (!currentUser) return;
  db.collection('notes')
    .where('uid', '==', currentUser.uid)
    .orderBy('pinned', 'desc')
    .orderBy('created', 'desc')
    .get()
    .then(snapshot => {
      let html = "";
      snapshot.forEach(doc => {
        const note = doc.data();
        html += `
  <div class="noteCard card shadow-sm m-2 p-3" style="width: 18rem; background: #fffde7;">
    <div class="card-body">
      <h5 class="card-title">${note.title}</h5>
      <p class="card-text">${note.text}</p>
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-danger btn-sm" title="Delete" onclick="showDeleteConfirm('${doc.id}')">
          <i class="bi bi-trash"></i>
        </button>
        <button class="btn btn-outline-primary btn-sm" title="Edit" onclick='openEditModal("${doc.id}", ${JSON.stringify(note).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})'>
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-warning btn-sm" title="${note.pinned ? 'Unpin' : 'Pin'}" onclick="togglePin('${doc.id}', ${note.pinned})">
          <i class="bi ${note.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'}"></i>
        </button>
      </div>
    </div>
  </div>
`;
      });
      document.getElementById("notes").innerHTML = html;
    });
}

// --- Edit Modal Logic ---
function openEditModal(docId, note) {
  document.getElementById('editNoteTitle').value = note.title;
  document.getElementById('editNoteTxt').value = note.text;
  document.getElementById('saveEditBtn').setAttribute('data-docid', docId);
  document.getElementById('editErrorMsg').style.display = 'none';
  const editModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
  editModal.show();
}

document.getElementById('saveEditBtn').addEventListener('click', function() {
  const docId = this.getAttribute('data-docid');
  const newTitle = document.getElementById('editNoteTitle').value.trim();
  const newText = document.getElementById('editNoteTxt').value.trim();
  if (!newTitle || !newText) {
    document.getElementById('editErrorMsg').textContent = 'Title and note text cannot be empty!';
    document.getElementById('editErrorMsg').style.display = 'block';
    return;
  }
  db.collection('notes').doc(docId).update({
    title: newTitle,
    text: newText
  }).then(() => {
    showNotes();
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
    if (editModal) editModal.hide();
  });
});

// --- Delete Modal Logic ---
let deleteDocId = null;
function showDeleteConfirm(docId) {
  deleteDocId = docId;
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
  deleteModal.show();
}
document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
  if (deleteDocId) {
    db.collection('notes').doc(deleteDocId).delete().then(() => {
      showNotes();
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
      if (deleteModal) deleteModal.hide();
      deleteDocId = null;
    });
  }
});

// Function to toggle pin status
function togglePin(docId, currentPinned) {
  db.collection('notes').doc(docId).update({
    pinned: !currentPinned
  }).then(showNotes);
}

document.addEventListener('DOMContentLoaded', function () {
    const addTitle = document.getElementById('addTitle');
    const addTxt = document.getElementById('addTxt');
    const noteInputGroup = document.getElementById('noteInputGroup');
    const errorMsg = document.getElementById('errorMsg');

    function showTitle() {
        addTitle.classList.remove('d-none');
    }

    function hideTitleIfEmpty() {
        if (!addTitle.value && document.activeElement !== addTitle && document.activeElement !== addTxt) {
            addTitle.classList.add('d-none');
        }
    }

    function autoSaveIfNeeded() {
      if (addTitle.value.trim() || addTxt.value.trim()) {
        if (currentUser) {
          db.collection('notes').add({
            uid: currentUser.uid,
            title: addTitle.value,
            text: addTxt.value,
            pinned: inputPinned,
            created: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            addTitle.value = "";
            addTxt.value = "";
            showNotes();
            inputPinned = false;
            toggleInputPin();
            if (errorMsg) {
              errorMsg.innerText = "";
              errorMsg.style.display = "none";
            }
          });
        }
      }
      hideTitleIfEmpty();
    }

    addTxt.addEventListener('focus', showTitle);
    addTitle.addEventListener('focus', showTitle);

    // On blur, check if both fields are not focused, then auto-save if needed
    function handleBlur() {
        setTimeout(() => {
            if (document.activeElement !== addTitle && document.activeElement !== addTxt) {
                autoSaveIfNeeded();
            }
        }, 100);
    }

    addTxt.addEventListener('blur', handleBlur);
    addTitle.addEventListener('blur', handleBlur);

    // Hide title on load if empty
    hideTitleIfEmpty();
});


const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('user-info');
const loginModal = document.getElementById('loginModal');

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

logoutBtn.onclick = () => auth.signOut();

// Show login modal if not logged in
function showLoginModal() {
  if (loginModal) {
    loginModal.classList.add('show');
    loginModal.style.display = 'flex';
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.classList.add('modal-blur');
  }
}
function hideLoginModal() {
  if (loginModal) {
    loginModal.classList.remove('show');
    loginModal.style.display = 'none';
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.classList.remove('modal-blur');
  }
}

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loginBtn.classList.add('d-none');
    logoutBtn.classList.remove('d-none');
    userInfo.innerHTML = `<img src="${user.photoURL}" class="rounded-circle" width="32" height="32" alt="User"/> <span class="ms-2">${user.displayName}</span>`;
    hideLoginModal();
    showNotes();
  } else {
    currentUser = null;
    loginBtn.classList.remove('d-none');
    logoutBtn.classList.add('d-none');
    userInfo.innerHTML = '';
    document.getElementById("notes").innerHTML = '';
    showLoginModal();
  }
});

