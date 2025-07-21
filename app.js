console.log("WELCOME TO NOTEAPP! GREATING FORM TEAM ADHERE");
showNotes();

// If user adds a note, add it to the localStorage
let addBtn = document.getElementById("addBtn");
if (addBtn) {
  addBtn.addEventListener("click", function () {
    let addTxt = document.getElementById("addTxt");
    let notes = localStorage.getItem("notes");
    let errorMsg = document.getElementById("errorMsg");

    if (!addTxt) {
      if (errorMsg) {
        errorMsg.innerText = "Note input not found!";
        errorMsg.style.display = "block";
      }
      return;
    }

    if (addTxt.value.trim() === "") {
      if (errorMsg) {
        errorMsg.innerText = "Note cannot be empty!";
        errorMsg.style.display = "block";
      }
      return;
    } else if (errorMsg) {
      errorMsg.innerText = "";
      errorMsg.style.display = "none";
    }

    let notesObj;
    if (notes == null) {
      notesObj = [];
    } else {
      notesObj = JSON.parse(notes);
    }
    notesObj.push(addTxt.value);

    localStorage.setItem("notes", JSON.stringify(notesObj));
    addTxt.value = "";
    showNotes();
  });
}
let addTxt = document.getElementById("addTxt");
if (addTxt) {
  addTxt.addEventListener("input", function () {
    let errorMsg = document.getElementById("errorMsg");
    if (addTxt.value.trim() !== "" && errorMsg && errorMsg.style.display === "block") {
      errorMsg.innerText = "";
      errorMsg.style.display = "none";
    }
  });
}
// Function to show elements from localStorage
function showNotes() {
  let notes = localStorage.getItem("notes");
  let notesObj = notes == null ? [] : JSON.parse(notes);
  let html = "";
  notesObj.forEach(function (element, index) {
    html += `
      <div class="noteCard my-2 mx-2 card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Note ${index + 1}</h5>
        <p class="card-text"> ${element}</p>
        <button id="${index}" onclick="openEditModal(${index})" class="btn btn-success">
          <i class="bi bi-pencil-square"></i> Edit
        </button>
        <button id="${index}" onclick="showDeleteConfirm(${index})" class="btn btn-danger">
          <i class="bi bi-trash"></i> Delete Note
        </button>
      </div>
      </div>`;
  });

  let notesElm = document.getElementById("notes");
  if (notesObj.length != 0) {
    notesElm.innerHTML = html;
  } else {
    notesElm.innerHTML = `Nothing to show! Use "Add a Note" section above to add notes.`;
  }
}


//function to save edited notes
let saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", function (){
    let notes = localStorage.getItem("notes");
    let notesObj = JSON.parse(notes);
    let saveindex = document.getElementById("saveindex").value;
    notesObj[saveindex]=addTxt.value;
    saveBtn.style.display="none"
    addBtn.style.display="block"
    addTxt.value=""
    localStorage.setItem("notes", JSON.stringify(notesObj));
    showNotes();
})

function openEditModal(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  document.getElementById('editNoteTxt').value = notes[index];
  document.getElementById('saveEditBtn').setAttribute('data-index', index);
  document.getElementById('editErrorMsg').style.display = 'none';
  const editModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
  editModal.show();
}

// Handle Save in modal
document.getElementById('saveEditBtn').addEventListener('click', function() {
  const index = this.getAttribute('data-index');
  const newText = document.getElementById('editNoteTxt').value.trim();
  if (!newText) {
    document.getElementById('editErrorMsg').textContent = 'Note text cannot be empty!';
    document.getElementById('editErrorMsg').style.display = 'block';
    return;
  }
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes[index] = newText;
  localStorage.setItem('notes', JSON.stringify(notes));
  showNotes();
  // Optionally, hide modal after saving
  const editModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
  if (editModal) editModal.hide();
});

// Function to delete a note
function deleteNote(index) {
  //   console.log("I am deleting", index);

  let notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }

  notesObj.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  showNotes();
}

let search = document.getElementById("searchTxt");
search.addEventListener("input", function () {
  let inputVal = search.value.toLowerCase();
  let noteCards = document.getElementsByClassName("noteCard");
  Array.from(noteCards).forEach(function (element) {
    let cardTxt = element.getElementsByTagName("p")[0].innerText;
    if (inputVal === "" || cardTxt.toLowerCase().includes(inputVal)) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
});

// Show delete confirmation modal
function showDeleteConfirm(index) {
  deleteIndex = index;
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
  deleteModal.show();
}

// Handle confirm delete
document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
  if (deleteIndex !== null) {
    let notes = localStorage.getItem("notes");
    let notesObj = notes ? JSON.parse(notes) : [];
    notesObj.splice(deleteIndex, 1);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    showNotes();
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
    if (deleteModal) deleteModal.hide();
    deleteIndex = null;
  }
});

let deleteIndex = null;

