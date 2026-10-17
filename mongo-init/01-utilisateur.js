// Exécuté UNE SEULE FOIS, au tout premier démarrage de MongoDB (volume vide).
// Crée l'utilisateur de l'application avec lecture/écriture sur chaque base listée
// dans docker-compose.yml (APP_DATABASES) : rien à modifier ici.
// MongoDB crée une base automatiquement à la première écriture.
const bases = (process.env.APP_DATABASES || "").split(/\s+/).filter(Boolean);

db.getSiblingDB("admin").createUser({
  user: process.env.APP_DB_USER,
  pwd: process.env.APP_DB_PASSWORD,
  roles: bases.map((b) => ({ role: "readWrite", db: b })),
});

print("Utilisateur " + process.env.APP_DB_USER + " créé pour : " + bases.join(", "));
