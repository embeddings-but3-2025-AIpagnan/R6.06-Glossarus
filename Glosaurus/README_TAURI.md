# 🦖 Glosaurus - Application Tauri

## 📋 Description
Votre application Preact a été intégrée avec succès dans Tauri ! Tauri permet de créer des applications de bureau natives à partir de votre frontend web.

## 🏗️ Structure du Projet

```
Tauri/
├── src/                      # Code source frontend (Preact)
│   ├── index.tsx            # Point d'entrée de l'application
│   ├── components/          # Composants réutilisables
│   │   ├── Header.tsx
│   │   └── AddWordModal.tsx
│   ├── pages/               # Pages de l'application
│   │   ├── Home/
│   │   └── _404.tsx
│   └── utils/               # Utilitaires
│       ├── api.ts
│       └── storage.ts
├── src-tauri/               # Code Rust (backend Tauri)
│   ├── src/
│   │   └── main.rs          # Point d'entrée Rust
│   ├── Cargo.toml           # Dépendances Rust
│   └── tauri.conf.json      # Configuration Tauri
├── public/                  # Fichiers statiques
├── index.html               # HTML de base
├── package.json             # Dépendances npm
└── vite.config.ts           # Configuration Vite
```

## 🚀 Commandes Disponibles

### Développement
```powershell
cd C:\TestFlet\Tauri
npm run tauri dev
```
Lance l'application en mode développement avec hot-reload.

### Build (Création de l'exécutable)
```powershell
cd C:\TestFlet\Tauri
npm run tauri build
```
Crée un exécutable Windows dans `src-tauri/target/release/`.

### Frontend uniquement
```powershell
npm run dev          # Serveur de développement Vite
npm run build        # Build du frontend
npm run preview      # Prévisualise le build
```

## 📦 Dépendances Installées

### Frontend
- **preact** : Framework UI léger
- **preact-iso** : Routing pour Preact
- **vite** : Build tool moderne
- **@preact/preset-vite** : Preset Vite pour Preact

### Tauri
- **@tauri-apps/api** : API JavaScript pour communiquer avec Rust
- **@tauri-apps/cli** : CLI Tauri pour build et dev
- **@tauri-apps/plugin-opener** : Plugin pour ouvrir des URLs

## 🔧 Configuration Tauri

Le fichier `src-tauri/tauri.conf.json` contient la configuration de votre application :
- Nom de l'application
- Icône de l'application
- Permissions système
- Configuration de la fenêtre

## 🎨 Différences avec le Frontend Web

### Avantages de Tauri
1. **Application native** : Fonctionne comme une vraie application Windows
2. **Performance** : Utilise le moteur de rendu natif du système
3. **Sécurité** : Sandboxing et contrôle des permissions
4. **Taille réduite** : Exécutables plus petits que Electron
5. **Accès système** : Peut accéder au système de fichiers, etc.

### Changements Importants
- Le localStorage fonctionne comme avant
- Les URLs relatives fonctionnent normalement
- L'API fetch fonctionne pour les requêtes HTTP

## 🔌 Communiquer entre Frontend et Backend

Vous pouvez appeler des fonctions Rust depuis votre frontend :

### Dans Rust (`src-tauri/src/main.rs`)
```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Dans TypeScript/Preact
```typescript
import { invoke } from '@tauri-apps/api/core';

const greeting = await invoke('greet', { name: 'World' });
```

## 📝 Prochaines Étapes

1. **Personnaliser l'icône** : Remplacez les icônes dans `src-tauri/icons/`
2. **Ajouter des commandes Rust** : Créez des fonctions backend si nécessaire
3. **Configurer les permissions** : Ajustez `tauri.conf.json` selon vos besoins
4. **Tester le build** : Créez un exécutable avec `npm run tauri build`

## 🐛 Résolution de Problèmes

### L'application ne se lance pas
- Vérifiez que Rust est installé : `rustc --version`
- Réinstallez les dépendances : `npm install`

### Erreurs de compilation Rust
- Mettez à jour Rust : `rustup update`
- Nettoyez le cache : `cd src-tauri && cargo clean`

### Le hot-reload ne fonctionne pas
- Relancez : `npm run tauri dev`
- Vérifiez que le port 1420 est disponible

## 📚 Resources

- [Documentation Tauri](https://tauri.app/)
- [Documentation Preact](https://preactjs.com/)
- [Tauri API Reference](https://tauri.app/v1/api/)
- [Guide de déploiement](https://tauri.app/v1/guides/distribution/)

## 🎉 Félicitations !

Votre application Preact fonctionne maintenant comme une application de bureau native grâce à Tauri !
