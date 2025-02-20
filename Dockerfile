# Utiliser l'image Node.js officielle
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port sur lequel l'application va écouter
EXPOSE 5050

# Commande pour démarrer l'application
CMD ["node", "server.js"]
