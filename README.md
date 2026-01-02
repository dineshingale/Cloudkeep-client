# ☁️ Cloudkeep Client

A modern, responsive note-taking and thought management application built with React, Vite, and Firebase. Cloudkeep allows you to capture thoughts, organize them with text blocks and file attachments, and access them securely from anywhere.

## 🚀 Features

-   **Authentication**: Secure Google Sign-In via Firebase Authentication.
-   **Thought Management**: Create, view, edit, and delete thoughts.
-   **Rich Content**: Thoughts can contain multiple blocks of text (notes) and file attachments.
-   **Timeline View**: Visualize your thoughts in a chronological timeline.
-   **Search**: Real-time filtering of thoughts/notes.
-   **Responsive Design**: Built with Tailwind CSS for a seamless experience on desktop and mobile.
-   **Interactive UI**: Smooth animations and transitions using `tailwindcss-animte` and Lucide icons.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Authentication & Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Linting**: ESLint

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dineshingale/Cloudkeep-client.git
    cd Cloudkeep-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    CThis project uses Firebase. You need to create a `firebase.js` configuration in `src/` (or use env variables) with your Firebase project credentials.
    
    *Typically, you should create a `.env` file in the root directory:*
    ```env
    VITE_API_KEY=your_api_key
    VITE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_PROJECT_ID=your_project_id
    VITE_STORAGE_BUCKET=your_project.appspot.com
    VITE_MESSAGING_SENDER_ID=your_sender_id
    VITE_APP_ID=your_app_id
    ```
    *(Note: Ensure `src/hooks/useAuth.js` and `src/firebase.js` are configured to read these variables.)*

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

5.  **Build for Production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── components/      # UI Components (Navbar, ThoughtCard, CreateThought, etc.)
├── hooks/           # Custom React Hooks (useAuth, useThoughtManager)
├── assets/          # Static assets
├── App.jsx          # Main application component
├── firebase.js      # Firebase configuration and initialization
└── main.jsx         # Application entry point
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
