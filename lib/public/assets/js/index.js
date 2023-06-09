// Initialize global variables
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
// WebPage URL validator
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}
// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};
let noteListItems = [];

// Function to fetch notes from the server
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });

// Function to save a new note into the server
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  }).then((response) => response.json())
  .then((data) => {
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// Function to delete a selected note from the server
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Function to render active note into the input fields
// sets the input fields to readonly
const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.ID) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.Title;
    noteText.value = activeNote.Content;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Function to handle saving a note
// Gets values from the inputs and sends 
// them to the saveNote() function to save it to the server
const handleNoteSave = () => {
  const newNote = {
    Title: noteTitle.value,
    Content: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to handle deleting a note
// Gets the id from the element
// if the activenote is deleted it variable is restarted
// hides the closes .card element so it content cant be
// reached while the server responds to the delete request
// Rerenders the list
const handleNoteDelete = (e) => {
  
  e.stopPropagation();
  const noteId = e.target.getAttribute('id');
  console.log(e);

  if (activeNote.ID === noteId) {
    activeNote = {};
  }

  const listItem = document.querySelector('.card');
  listItem.classList.add('d-none');
  
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
// Gets the content from the data-note attribute and sets it into que active note
// which will display it content in the input fields
const handleNoteView = (e) => {
  e.preventDefault();  
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// Sets the save icon as hide and show depending from the content of the inputs.
// both input must be filled to show the icon
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes;
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }
  console.log(await notes);
  noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text,id, delBtn) => {
    const liEl = document.createElement('li');
    liEl.setAttribute('class','card rounded-0 border-0 border-bottom border-3');

    const divEl = document.createElement('div');
    divEl.setAttribute('class','card-body row ');

    const pEl = document.createElement('p');
    pEl.setAttribute('class','col-10 fs-4 unselectable');
    pEl.innerText = text;
    divEl.appendChild(pEl);

    if (delBtn) {
      divEl.addEventListener('click', handleNoteView);

      const diviEl = document.createElement('div');
      diviEl.setAttribute('class','col-2 d-flex align-items-center');

      const delBtnEl = document.createElement('i');
      delBtnEl.setAttribute('class','fas fa-trash-can fa-xl h-50 d-flex align-items-center');
      delBtnEl.setAttribute('style','color: #d7370f;');
      delBtnEl.setAttribute('id',id);

      delBtnEl.addEventListener('click', handleNoteDelete);

      diviEl.appendChild(delBtnEl);
      divEl.appendChild(diviEl);
    }
    liEl.appendChild(divEl);

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', 0,false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.Title,note.ID, true);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(data => renderNoteList(data));

// WebPage URL validator
// set the event listener when the URL is the correct
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}  
getAndRenderNotes();

