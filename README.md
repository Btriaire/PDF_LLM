# AuraDoc - IA pour vos PDFs

Une application web pour uploader des PDFs et converser avec une IA (Mistral 7B) pour extraire rapidement des informations, répondre à des questions et analyser le contenu.

## Caractéristiques

- ✅ Upload et stockage des PDFs (Firebase Storage)
- ✅ Chat interactif avec Mistral 7B (Hugging Face Spaces)
- ✅ Authentification multi-utilisateur
- ✅ Historique des conversations
- ✅ Extraction automatique du texte des PDFs
- ✅ Interface moderne avec Tailwind CSS

## Setup

### 1. Cloner et installer

```bash
cd pdf-chat-app
npm install
```

### 2. Configurer Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Créer un nouveau projet
3. Ajouter une web app
4. Copier les credentials dans `.env.local`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

5. Activer dans Firebase:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage

### 3. Configurer Hugging Face

1. Aller sur [Hugging Face](https://huggingface.co/)
2. Créer un compte et générer une API key
3. Ajouter dans `.env.local`:

```
VITE_HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxx
```

### 4. Lancer l'app

```bash
npm run dev
```

L'app sera disponible sur `http://localhost:5173`

## Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Firebase Cloud Functions
- **Storage**: Firebase Storage + Firestore
- **LLM**: Mistral 7B (Hugging Face Spaces)

## Limitations MVP

- Simple full-text search (pas de vecteurs)
- Latence ~15-40s par réponse (CPU Hugging Face)
- Max 50K Firestore reads/writes par jour (gratuit)
- 1GB storage gratuit

## Escalade Future

- Ajouter embeddings vectoriels
- Migrer à API LLM payante (Claude, OpenAI)
- Ajouter des features (annotations, partage, etc.)
- Setup serveur Mistral dédié

## Développement

```bash
npm run dev          # Lancer le serveur de dev
npm run build        # Compiler pour production
npm run lint         # Lint avec ESLint
npm run preview      # Préview de la build
```
