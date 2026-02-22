FROM node:20-alpine

WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copie du code source
COPY . .

# Exposition du port Vite
EXPOSE 5173

# Lancement de Vite avec l'option --host pour être accessible hors du conteneur
#CMD ["npm", "run", "dev", "--", "--host"]
# CMD ["npm","run","start"]
# Render fournit le port dans $PORT
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port ${PORT:-5173}"]
