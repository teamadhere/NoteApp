// notes.js
// Note CRUD operations, UI rendering, and event handlers
import { currentUser } from './auth.js'; // Current authenticated user
import { db } from './firebase.js'; // Firestore database instance
import { showModal } from './modal.js';

// State variables

let inputPinned = false; // Tracks if the input note is pinned
let deleteDocId = null; // Stores the document ID to be deleted

// LocalStorage helpers for notes (when not logged in)
function getLocalNotes() {
  const notes = JSON.parse(localStorage.getItem('localNotes') || '[]');
  return notes;
}
function setLocalNotes(notes) {
  localStorage.setItem('localNotes', JSON.stringify(notes));
}
function addLocalNote(note) {
  const notes = getLocalNotes();
  notes.unshift(note);
  setLocalNotes(notes);
}
function updateLocalNote(index, newNote) {
  const notes = getLocalNotes();
  notes[index] = { ...notes[index], ...newNote };
  setLocalNotes(notes);
}
function deleteLocalNote(index) {
  const notes = getLocalNotes();
  notes.splice(index, 1);
  setLocalNotes(notes);
}

  // Toggle the pin state for the note input
  const pinBtn = document.getElementById('pinBtn');
  if (pinBtn) {
    pinBtn.classList.toggle('active');
    console.log('Pin button toggled. Now active:', pinBtn.classList.contains('active'));
  }
  inputPinned = !inputPinned;
  console.log('Input pinned state:', inputPinned);

// Render all notes for the current user or from localStorage
export function showNotes() {
  let html = "";
  if (currentUser) {
    db.collection('notes')
      .where('uid', '==', currentUser.uid)
      .orderBy('pinned', 'desc')
      .orderBy('created', 'desc')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const note = doc.data();
          html += `
  <div class="noteCard card shadow-sm m-2 p-3" style="width: 18rem; background: #fffde7;">
    <div class="card-body">
      <h5 class="card-title">${note.title}</h5>
      <p class="card-text">${note.text}</p>
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-danger btn-sm" title="Delete" data-id="${doc.id}" data-action="delete">
          <i class="bi bi-trash"></i>
        </button>
        <button class="btn btn-outline-primary btn-sm" title="Edit" data-id="${doc.id}" data-note='${JSON.stringify(note).replace(/'/g, "&apos;").replace(/"/g, "&quot;")}' data-action="edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-warning btn-sm" title="${note.pinned ? 'Unpin' : 'Pin'}" data-id="${doc.id}" data-pinned="${note.pinned}" data-action="pin">
          <i class="bi ${note.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'}"></i>
        </button>
      </div>
    </div>
  </div>
`;
        });
        document.getElementById("notes").innerHTML = html;
        console.log('Notes rendered:', snapshot.size);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
      });
  } else {
    // Use localStorage
    const notes = getLocalNotes();
    notes.forEach((note, idx) => {
      html += `
  <div class="noteCard card shadow-sm m-2 p-3" style="width: 18rem; background: #fffde7;">
    <div class="card-body">
      <h5 class="card-title">${note.title}</h5>
      <p class="card-text">${note.text}</p>
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-danger btn-sm" title="Delete" data-id="${idx}" data-action="delete">
          <i class="bi bi-trash"></i>
        </button>
        <button class="btn btn-outline-primary btn-sm" title="Edit" data-id="${idx}" data-note='${JSON.stringify(note).replace(/'/g, "&apos;").replace(/"/g, "&quot;")}' data-action="edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-warning btn-sm" title="${note.pinned ? 'Unpin' : 'Pin'}" data-id="${idx}" data-pinned="${note.pinned}" data-action="pin">
          <i class="bi ${note.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'}"></i>
        </button>
      </div>
    </div>
  </div>
`;
    });
    document.getElementById("notes").innerHTML = html;
    console.log('Local notes rendered:', notes.length);
  }
}

// Open the edit modal and populate it with the note's data
export function openEditModal(docId, note) {
  let errorMsg = '';
  function renderEditBody() {
    return `
      <input type="text" id="editNoteTitle" class="form-control mb-2" placeholder="Title" value="${note.title}">
      <textarea id="editNoteTxt" class="form-control" rows="3" placeholder="Note">${note.text}</textarea>
      <div id="editErrorMsg" class="text-danger mt-2" style="display:${errorMsg ? 'block' : 'none'};">${errorMsg}</div>
    `;
  }
  function showEditModal() {
    showModal({
      title: 'Edit Note',
      body: renderEditBody(),
      buttons: [
        { text: 'Cancel', class: 'btn-secondary', onClick: (e, modal) => modal.hide() },
        { text: 'Save', class: 'btn-primary', onClick: (e, modal) => {
            const newTitle = document.getElementById('editNoteTitle').value.trim();
            const newText = document.getElementById('editNoteTxt').value.trim();
            if (!newTitle || !newText) {
              errorMsg = 'Title and note text cannot be empty!';
              showEditModal();
              return;
            }
            if (currentUser) {
              db.collection('notes').doc(docId).update({
                title: newTitle,
                text: newText
              }).then(() => {
                console.log('Note updated for docId:', docId);
                showNotes();
                modal.hide();
              }).catch(error => {
                errorMsg = 'Error updating note: ' + error.message;
                showEditModal();
              });
            } else {
              // LocalStorage update
              updateLocalNote(Number(docId), { title: newTitle, text: newText });
              showNotes();
              modal.hide();
            }
          }
        }
      ]
    });
    console.log('Edit modal opened for docId:', docId);
  }
  showEditModal();
}

// Show the delete confirmation modal
export function showDeleteConfirm(docId) {
  deleteDocId = docId;
  showModal({
    title: 'Delete Note',
    body: 'Are you sure you want to delete this note?',
    buttons: [
      { text: 'Cancel', class: 'btn-secondary', onClick: (e, modal) => modal.hide() },
      { text: 'Delete', class: 'btn-danger', onClick: (e, modal) => {
          if (deleteDocId !== null) {
            if (currentUser) {
              db.collection('notes').doc(deleteDocId).delete().then(() => {
                console.log('Note deleted for docId:', deleteDocId);
                showNotes();
                modal.hide();
                deleteDocId = null;
              }).catch(error => {
                alert('Error deleting note: ' + error.message);
              });
            } else {
              // LocalStorage delete
              deleteLocalNote(Number(deleteDocId));
              showNotes();
              modal.hide();
              deleteDocId = null;
            }
          }
        }
      }
    ]
  });
  console.log('Delete confirmation shown for docId:', docId);
}

// Toggle the pinned state of a note
export function togglePin(docId, currentPinned) {
  if (currentUser) {
    db.collection('notes').doc(docId).update({
      pinned: !currentPinned
    })
    .then(() => {
      console.log('Pin toggled for docId:', docId, 'Now pinned:', !currentPinned);
      showNotes();
    })
    .catch(error => {
      console.error('Error toggling pin:', error);
    });
  } else {
    // LocalStorage pin toggle
    const notes = getLocalNotes();
    notes[Number(docId)].pinned = !currentPinned;
    setLocalNotes(notes);
    showNotes();
  }
}

// Initialize note event listeners and auto-save logic
export function initNotes() {
  // Set up event listeners for note input and auto-save
  document.addEventListener('DOMContentLoaded', function () {
    const addTitle = document.getElementById('addTitle');
    const addTxt = document.getElementById('addTxt');
    const errorMsg = document.getElementById('errorMsg');

    // Show the title input when the note text is focused
    function showTitle() {
      addTitle.classList.remove('d-none');
    }

    // Hide the title input if both fields are empty and not focused
    function hideTitleIfEmpty() {
      if (!addTitle.value && document.activeElement !== addTitle && document.activeElement !== addTxt) {
        addTitle.classList.add('d-none');
      }
    }

    // Toggle the pin state for the note input UI
    function toggleInputPin() {
      const pinBtn = document.getElementById('pinBtn');
      if (pinBtn) {
        pinBtn.classList.toggle('active', inputPinned);
      }
    }

    // Auto-save the note if either field has content
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
            console.log('Note added for user:', currentUser.uid);
            addTitle.value = "";
            addTxt.value = "";
            showNotes();
            inputPinned = false;
            toggleInputPin();
            if (errorMsg) {
              errorMsg.innerText = "";
              errorMsg.style.display = "none";
            }
          }).catch(error => {
            console.error('Error adding note:', error);
          });
        } else {
          // LocalStorage add
          addLocalNote({
            title: addTitle.value,
            text: addTxt.value,
            pinned: inputPinned,
            created: Date.now()
          });
          addTitle.value = "";
          addTxt.value = "";
          showNotes();
          inputPinned = false;
          toggleInputPin();
          if (errorMsg) {
            errorMsg.innerText = "";
            errorMsg.style.display = "none";
          }
        }
      }
      hideTitleIfEmpty();
    }

    addTxt.addEventListener('focus', showTitle);
    addTitle.addEventListener('focus', showTitle);

    // Handle blur event to trigger auto-save
    function handleBlur() {
      setTimeout(() => {
        if (document.activeElement !== addTitle && document.activeElement !== addTxt) {
          autoSaveIfNeeded();
        }
      }, 100);
    }

    addTxt.addEventListener('blur', handleBlur);
    addTitle.addEventListener('blur', handleBlur);

    hideTitleIfEmpty();

    // Event delegation for note card buttons (delete, edit, pin)
    document.getElementById('notes').addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const docId = btn.getAttribute('data-id');
      if (action === 'delete') {
        showDeleteConfirm(docId);
      } else if (action === 'edit') {
        const note = JSON.parse(btn.getAttribute('data-note').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
        openEditModal(docId, note);
      } else if (action === 'pin') {
        const pinned = btn.getAttribute('data-pinned') === 'true';
        togglePin(docId, pinned);
      }
    });

    // No need for static modal event listeners; handled by showModal now
    // Show notes on load
    showNotes();
  });
}
