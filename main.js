const apiBaseUrl = 'https://notes-api.dicoding.dev/v2';

document.addEventListener('DOMContentLoaded', () => {
  renderLoading(true); // Show loading indicator

  fetchNotes()
    .then(notes => {
      renderNotes(notes);
      renderLoading(false); // Hide loading indicator
    })
    .catch(error => {
      console.error('Error fetching notes:', error);
      renderLoading(false); // Hide loading indicator in case of error
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

// const predefinedNotes = [
//   {
//     id: 'notes-jT-jjsyz61J8XKiI',
//     title: 'Welcome to Notes, Dimas!',
//     body: 'Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.',
//     createdAt: '2022-07-28T10:03:12.594Z',
//     archived: false,
//   },
//   {
//     id: 'notes-aB-cdefg12345',
//     title: 'Meeting Agenda',
//     body: 'Discuss project updates and assign tasks for the upcoming week.',
//     createdAt: '2022-08-05T15:30:00.000Z',
//     archived: false,
//   },
//   {
//     id: 'notes-XyZ-789012345',
//     title: 'Shopping List',
//     body: 'Milk, eggs, bread, fruits, and vegetables.',
//     createdAt: '2022-08-10T08:45:23.120Z',
//     archived: false,
//   },
//   {
//     id: 'notes-1a-2b3c4d5e6f',
//     title: 'Personal Goals',
//     body: 'Read two books per month, exercise three times a week, learn a new language.',
//     createdAt: '2022-08-15T18:12:55.789Z',
//     archived: false,
//   },
//   {
//     id: 'notes-LMN-456789',
//     title: 'Recipe: Spaghetti Bolognese',
//     body: 'Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...',
//     createdAt: '2022-08-20T12:30:40.200Z',
//     archived: false,
//   },
//   {
//     id: 'notes-QwErTyUiOp',
//     title: 'Workout Routine',
//     body: 'Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.',
//     createdAt: '2022-08-25T09:15:17.890Z',
//     archived: false,
//   },
//   {
//     id: 'notes-abcdef-987654',
//     title: 'Book Recommendations',
//     body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
//     createdAt: '2022-09-01T14:20:05.321Z',
//     archived: false,
//   },
//   {
//     id: 'notes-zyxwv-54321',
//     title: 'Daily Reflections',
//     body: 'Write down three positive things that happened today and one thing to improve tomorrow.',
//     createdAt: '2022-09-07T20:40:30.150Z',
//     archived: false,
//   },
//   {
//     id: 'notes-poiuyt-987654',
//     title: 'Travel Bucket List',
//     body: '1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA',
//     createdAt: '2022-09-15T11:55:44.678Z',
//     archived: false,
//   },
//   {
//     id: 'notes-asdfgh-123456',
//     title: 'Coding Projects',
//     body: '1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project',
//     createdAt: '2022-09-20T17:10:12.987Z',
//     archived: false,
//   },
//   {
//     id: 'notes-5678-abcd-efgh',
//     title: 'Project Deadline',
//     body: 'Complete project tasks by the deadline on October 1st.',
//     createdAt: '2022-09-28T14:00:00.000Z',
//     archived: false,
//   },
//   {
//     id: 'notes-9876-wxyz-1234',
//     title: 'Health Checkup',
//     body: 'Schedule a routine health checkup with the doctor.',
//     createdAt: '2022-10-05T09:30:45.600Z',
//     archived: false,
//   },
//   {
//     id: 'notes-qwerty-8765-4321',
//     title: 'Financial Goals',
//     body: '1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.',
//     createdAt: '2022-10-12T12:15:30.890Z',
//     archived: false,
//   },
//   {
//     id: 'notes-98765-54321-12345',
//     title: 'Holiday Plans',
//     body: 'Research and plan for the upcoming holiday destination.',
//     createdAt: '2022-10-20T16:45:00.000Z',
//     archived: false,
//   },
//   {
//     id: 'notes-1234-abcd-5678',
//     title: 'Language Learning',
//     body: 'Practice Spanish vocabulary for 30 minutes every day.',
//     createdAt: '2022-10-28T08:00:20.120Z',
//     archived: false,
//   },
// ];

// console.log(predefinedNotes);

const renderLoading = (isLoading) => {
  const loadingElement = document.getElementById('loading-indicator');
  if (isLoading) {
    loadingElement.style.display = 'block';
  } else {
    loadingElement.style.display = 'none';
  }
};

const fetchNotes = async () => {
  const response = await fetch(`${apiBaseUrl}/notes`);
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};

const createNote = async (newNote) => {
  const response = await fetch(`${apiBaseUrl}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNote),
  });
  if (!response.ok) throw new Error('Failed to create note');
};

const renderNotes = (notes) => {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  notes.forEach(note => {
    const noteElement = document.createElement('note-item');
    noteElement.noteData = note;
    noteElement.addEventListener('delete-note', () => {
      deleteNote(note.id)
        .then(() => fetchNotes())
        .then(updatedNotes => renderNotes(updatedNotes))
        .catch(error => console.error('Error deleting note:', error));
    });
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

const deleteNote = async (noteId) => {
  const response = await fetch(`${apiBaseUrl}/notes/${noteId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete note');
  return response.json();
};


customElements.define('app-bar', AppBar);
