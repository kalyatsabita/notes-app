// Import LoadingIndicator jika diperlukan
import './loading-indicator.js';
// import './style.css';


const apiBaseUrl = 'https://notes-api.dicoding.dev/v2';
document.addEventListener('DOMContentLoaded', () => {
  renderLoading(true); // Tampilkan loading indicator
  fetchNotes()
    .then(notes => {
      renderNotes(notes);
      renderLoading(false); // Sembunyikan loading indicator
    })
    .catch(error => {
      console.error('Error fetching notes:', error);
      renderLoading(false); // Sembunyikan loading indicator jika terjadi error
    });

  const noteForm = document.querySelector('note-form');
  noteForm.addEventListener('add-note', (event) => {
    const newNote = event.detail.newNote;
    createNote(newNote)
      .then(() => fetchNotes())
      .then(notes => renderNotes(notes))
      .catch(error => console.error('Error creating note:', error));
  });
});

const showLoading = () => {
  document.getElementById('loading').style.display = 'block';
};

const hideLoading = () => {
  document.getElementById('loading').style.display = 'none';
};

const fetchNotes = async () => {
  showLoading(); // Tampilkan loading
  try {
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
    const data = await response.json();
    console.log('Data dari API:', data); // Periksa data yang diterima
    if (data.data) {
      renderNotes(data.data); // Render data ke DOM
    } else {
      console.error('Data tidak ditemukan');
    }
  } catch (error) {
    console.error('Gagal mengambil data:', error);
    alert('Gagal mengambil data!');
  } finally {
    hideLoading(); // Sembunyikan loading
  }
};

// Add new note using API
const createNote = async (newNote) => {
  try {
    const response = await fetch(`${apiBaseUrl}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to add note:', error);
    alert('Failed to add note!');
  }
};

const renderNotes = (notes) => {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = ''; // Kosongkan konten sebelumnya

  if (notes.length === 0) {
    notesList.innerHTML = '<p>Tidak ada catatan.</p>'; // Tampilkan pesan jika tidak ada data
    return;
  }

  notes.forEach(note => {
    const noteElement = document.createElement('note-item');
    noteElement.noteData = note; // Set data ke custom element
    notesList.appendChild(noteElement);
  });
};


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
      </style>
      <div class="note-item">
        <h3></h3>
        <p></p>
        <span></span>
        <button class="delete-btn">Delete</button>
      </div>
    `;
  }

  connectedCallback() {
    this.updateContent();
    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-note'));
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
      id: Date.now(),
      title,
      body,
      createdAt: new Date().toISOString(),
    };

    const eventDetail = { newNote };
    this.dispatchEvent(new CustomEvent('add-note', { detail: eventDetail }));

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

class AppBar extends HTMLElement {
  constructor() {
    super();
    console.log('AppBar component created')
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

// Delete note using API
const deleteNote = async (noteId) => {
  try {
    await fetch(`${apiBaseUrl}/notes/${noteId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete note:', error);
    alert('Failed to delete note!');
  }
};

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

customElements.define('app-bar', AppBar);
