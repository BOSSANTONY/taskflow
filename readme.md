# TaskFlow — projet complet

Ce projet réunit les deux parties demandées :

1. Une page d'accueil/vitrine inspirée de la structure visuelle du template Glamping de Weblium :
   - header avec Accueil
   - grande image hero
   - CTA
   - sections aérées
   - palette crème / vert / orange / charbon
   - présentation des fonctionnalités
   - méthode
   - témoignage
   - appel à l'action
   - footer

2. La vraie application TaskFlow, accessible via « Ouvrir TaskFlow » :
   - connexion / inscription locale
   - tableau de bord
   - création/modification/suppression de tâches
   - attribution des tâches
   - projets
   - statuts et priorités
   - échéances
   - recherche et filtres
   - vue Kanban + glisser-déposer
   - calendrier
   - membres d'équipe
   - commentaires
   - fichiers (le nom/métadonnées du fichier sont conservés dans localStorage)
   - notifications
   - rapports + export CSV
   - paramètres
   - profil
   - responsive desktop/tablette/mobile

## Compte de démo

Email : admin@taskflow.local
Mot de passe : admin123

## Lancer

Ouvrir `index.html` dans un navigateur moderne.
Pour un développement plus confortable : VS Code + Live Server.

## Données

La démo est 100% frontend : les données sont sauvegardées dans `localStorage`.

Pour une vraie application multi-utilisateur en production, il faudra remplacer le stockage local par un backend et une base de données (API, authentification sécurisée, stockage de fichiers, etc.).
