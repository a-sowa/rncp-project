# 💆‍♀️ Projet RNCP DWWM – Site de réservation pour une Art-Thérapeute

Ce projet a été réalisé dans le cadre de la certification RNCP niveau 5 – Développeur Web et Web Mobile.  
Il s'agit d'une plateforme de prise de rendez-vous en ligne pour un cabinet d’art-thérapie, avec une interface utilisateur et une interface administrateur.

---

## 🛠️ Technologies utilisées

### Frontend
- HTML5, CSS3
- JavaScript (Vanilla)
- Tailwind CSS (via CDN)
- Flatpickr (sélecteur de date)
- Responsive design + Accessibilité (normes ARIA, contraste)

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JSON Web Token (JWT)
- Bcrypt (hash des mots de passe)

---

## 📌 Fonctionnalités

### 🔓 Utilisateurs
- Inscription, connexion sécurisée
- Prise de rendez-vous via calendrier interactif
- Affichage des créneaux disponibles (uniquement)
- Historique des rendez-vous passés et à venir

### 🛠️ Administrateur
- Interface de connexion dédiée
- Tableau de bord des rendez-vous du jour
- Consultation de tous les rendez-vous
- Ajout, modification et suppression de créneaux
- Annulation des rendez-vous à venir

---

## 📁 Structure du projet

```
rncp-project/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── index.html
│   ├── login.html / register.html
│   ├── rendezvous.html / confirmation.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   └── creneaux.html / rendezvous.html
│   ├── components/
│   │   └── navbar.html, footer.html
│   ├── scripts/
│   └── public/styles/
└── README.md
```

---

## 🔐 Sécurité

- Mot de passe utilisateur hashé avec bcrypt
- Authentification JWT avec expiration
- Middleware de vérification des rôles (user/admin)
- Validation des données côté frontend et backend
- Protection des routes sensibles
- Respect des bonnes pratiques OWASP de base

---

## 🧪 Tests & Jeux d’essai

- Créneaux dynamiques selon la base de données
- Vérification de la réservation atomique (créneau bloqué une seule fois)
- Redirections et affichage de messages si utilisateur non connecté
- Cas test : réservation multiple, créneau déjà pris, redirections selon rôle

---

## 🚀 Lancer le projet en local

1. Cloner le projet :

```bash
git clone https://github.com/ton-utilisateur/rncp-project.git
cd rncp-project
```

2. Configurer l’environnement backend :

```bash
cd backend
npm install
cp .env.example .env
# Renseigner MONGO_URI et JWT_SECRET
npm run dev
```

3. Ouvrir le frontend :

```bash
cd ../frontend
# Ouvrir index.html avec Live Server ou un serveur local
```

---

## 📷 Captures d’écran

*(À insérer si besoin pour documenter l’interface utilisateur, admin, calendrier, etc.)*

---

## 📚 Auteur

Axel Sowa – Développeur Web & Web Mobile  
Projet présenté dans le cadre du **Titre Professionnel RNCP DWWM (niveau 5)**

---

## ✅ Statut du projet

✔️ Finalisé  
📂 Dossier professionnel validé  
🎯 Prêt pour la soutenance

---

## 🔗 Liens utiles

- [Flatpickr](https://flatpickr.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
- [MongoDB](https://www.mongodb.com/atlas/database)
- [OWASP Security](https://owasp.org/)