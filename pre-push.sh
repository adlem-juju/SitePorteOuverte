#!/bin/bash

# 1. Régénérer la photo de la BDD
echo "📸 Extraction de la base de données..."
docker exec pwa_db pg_dump -U strapi strapi_db > sauvegarde_colliniere.sql

# 2. Ajouter le nouveau fichier SQL au commit
git add sauvegarde_colliniere.sql

echo "✅ Sauvegarde prête pour le push !"
