# Utilisation de l'image Node.js officielle (LTS)
FROM node:20-alpine

# Installation des dépendances système pour Strapi
RUN apk add --no-cache build-base gcc autoconf automake libtool zlib-dev vips-dev git

# Définition du répertoire de travail
WORKDIR /opt/app

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation des modules
RUN npm install

# Copie du reste du code source
COPY . .

# Construction de l'interface d'administration
RUN npm run build

# Exposition du port Strapi
EXPOSE 1337

# Commande de lancement en mode développement
CMD ["npm", "run", "develop"]
