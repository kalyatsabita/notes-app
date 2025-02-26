let notesData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchNotes();
});

const loading = document.getElementById('loading');

import Swal from 'sweetalert2';

const fetchNotes = async () => {
  loading.classList.add('active');
  try {
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
    const data = await response.json();
    notesData = data.data;
    renderNotes();
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to fetch notes!',
    });
  } finally {
    loading.classList.remove('active');
  }
};

const addNote = async (newNote) => {
  loading.classList.add('active');
  try {
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    });
    const addedNote = await response.json();
    notesData.push(addedNote.data);
    renderNotes();
  } catch (error) {
    console.error('Failed to add note:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to add note!',
    });
  } finally {
    loading.classList.remove('active');
  }
};

const deleteNote = async (noteId) => {
  loading.classList.add('active');
  try {
    await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
      method: 'DELETE',
    });
    notesData = notesData.filter(note => note.id !== noteId);
    renderNotes();
  } catch (error) {
    console.error('Failed to delete note:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to delete note!',
    });
  } finally {
    loading.classList.remove('active');
  }
};

import anime from 'animejs/lib/anime.es.js';

const renderNotes = () => {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = ''; 

  notesData.forEach(note => {
    const noteElement = document.createElement('note-item');
    noteElement.noteData = note;
    notesList.appendChild(noteElement);
  });

  anime({
    targets: '.note-item',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutExpo',
    delay: anime.stagger(100),
  });
};

class NoteForm extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        form div {
          margin-bottom: 10px;
        }
        label {
          font-weight: bold;
        }
        input, textarea {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          background-color: #DEB887;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #333;
        }
        .error {
          color: red;
          font-size: 0.9rem;
        }
      </style>
      <form id="noteForm">
        <div>
          <label for="noteTitle">Title</label>
          <input id="noteTitle" type="text" placeholder="Note title" required />
          <span class="error" id="titleError"></span>
        </div>
        <div>
          <label for="noteBody">Body</label>
          <textarea id="noteBody" placeholder="Write your note here..." required></textarea>
          <span class="error" id="bodyError"></span>
        </div>
        <button type="submit">Add Note</button>
      </form>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#noteForm').addEventListener('submit', this.onSubmit.bind(this));
    this.shadowRoot.querySelector('#noteTitle').addEventListener('input', this.validateTitle.bind(this));
    this.shadowRoot.querySelector('#noteBody').addEventListener('input', this.validateBody.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();

    const title = this.shadowRoot.querySelector('#noteTitle').value.trim();
    const body = this.shadowRoot.querySelector('#noteBody').value.trim();

    if (!title || !body) {
      alert('Please fill out all fields!');
      return;
    }

    const newNote = {
      title,
      body,
    };

    addNote(newNote);

    this.shadowRoot.querySelector('#noteForm').reset();
    this.clearErrors();
  }

  validateTitle() {
    const title = this.shadowRoot.querySelector('#noteTitle').value.trim();
    const titleError = this.shadowRoot.querySelector('#titleError');
    if (title === '') {
      titleError.textContent = 'Title cannot be empty';
    } else {
      titleError.textContent = '';
    }
  }

  validateBody() {
    const body = this.shadowRoot.querySelector('#noteBody').value.trim();
    const bodyError = this.shadowRoot.querySelector('#bodyError');
    if (body === '') {
      bodyError.textContent = 'Body cannot be empty';
    } else {
      bodyError.textContent = '';
    }
  }

  clearErrors() {
    this.shadowRoot.querySelector('#titleError').textContent = '';
    this.shadowRoot.querySelector('#bodyError').textContent = '';
  }
}

customElements.define('note-form', NoteForm);

const archiveNote = async (noteId) => {
  try {
    await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}/archive`, {
      method: 'POST',
    });
    fetchNotes(); // Refresh the notes list
  } catch (error) {
    console.error('Failed to archive note:', error);
    alert('Failed to archive note!');
  }
};

// Add archive button to NoteItem
class NoteItem extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .note-item {
          padding: 15px;
          background: #f4f4f4;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }
        .note-item h3 {
          margin: 0 0 10px;
        }
        .note-item p {
          margin: 0;
        }
        .note-item span {
          font-size: 0.8rem;
          color: #888;
        }
        .note-item button {
          margin-right: 5px;
        }
      </style>
      <div class="note-item">
        <h3></h3>
        <p></p>
        <span></span>
        <button class="delete-btn">Delete</button>
        <button class="archive-btn">Archive</button>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
      const noteId = this._noteData.id;
      deleteNote(noteId);
    });

    this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
      const noteId = this._noteData.id;
      archiveNote(noteId);
    });
  }

  set noteData(data) {
    this._noteData = data;
    this.updateContent();
  }

  updateContent() {
    if (this._noteData) {
      this.shadowRoot.querySelector('h3').textContent = this._noteData.title;
      this.shadowRoot.querySelector('p').textContent = this._noteData.body;
      this.shadowRoot.querySelector('span').textContent = new Date(this._noteData.createdAt).toLocaleString();
    }
  }
}

customElements.define('note-item', NoteItem);

class AppBar extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        header {
          background-color: #DEB887;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
      </style>
      <header>
        <h1>Notes App</h1>
      </header>
    `;
  }
}

customElements.define('app-bar', AppBar);