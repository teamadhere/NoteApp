# NoteApp

NoteApp is a simple, modern note-taking web application built with HTML, CSS, and JavaScript. It supports Google authentication, cloud sync with Firebase Firestore, and offline/local note storage for unauthenticated users. The UI is responsive and uses Bootstrap 5 and Bootstrap Icons.

## Features

- Google Sign-In authentication (via Firebase)
- Add, edit, delete, and pin notes
- Notes are synced to Firestore for logged-in users
- LocalStorage fallback for guests (no login required)
- Responsive, mobile-friendly UI
- Search notes by text
- Reusable modal dialogs for actions and confirmations
- Modern design with Bootstrap 5 and Bootstrap Icons

## Screenshots

![Screenshot (70)](https://user-images.githubusercontent.com/36407996/120914334-3678c300-c6bb-11eb-99e8-0b7644cfe47c.png)

## Tech Stack

- HTML5, CSS3
- JavaScript (ES6 modules)
- Bootstrap 5
- Bootstrap Icons
- Firebase (Auth, Firestore)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/teamadhere/NoteApp.git
   cd NoteApp
   ```

2. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Google authentication and Firestore database.
   - Replace the config in `firebase.js` with your own Firebase project credentials if needed.

3. **Run the app:**
   - Open `index.html` directly in your browser.
   - Or use a local server (recommended for module support):
     ```bash
     npx serve .
     # or
     python -m http.server
     ```

## Usage

- **Sign in:** Click the Google login button to sign in. Your notes will be synced to your Google account.
- **Add a note:** Type in the note area. The title field appears when you start typing. Notes auto-save on blur.
- **Pin a note:** Click the pin icon to pin/unpin a note. Pinned notes appear at the top.
- **Edit/Delete:** Use the pencil or trash icons on each note card.
- **Search:** Use the search bar to filter notes by text.
- **Logout:** Use the user dropdown to sign out.

## File Structure

- `index.html` - Main HTML file
- `style.css` - Custom styles
- `firebase.js` - Firebase config and initialization
- `auth.js` - Authentication logic
- `notes.js` - Note CRUD and UI logic
- `modal.js` - Reusable modal utility
- `constants.js` - UI text constants

