# 📝 Notes de Migration : Preact Web → Tauri

## ✅ Ce qui a été migré

### Structure des fichiers
Tous vos fichiers sources ont été copiés du dossier `front_end` vers `Tauri` :

```
✅ src/index.tsx              → Point d'entrée
✅ src/components/            → Tous les composants
   ├── Header.tsx
   ├── Header.css
   ├── AddWordModal.tsx
   └── AddWordModal.css
✅ src/pages/                 → Toutes les pages
   ├── Home/index.tsx
   ├── Home/style.css
   └── _404.tsx
✅ src/utils/                 → Utilitaires
   ├── api.ts
   └── storage.ts
✅ public/                    → Assets statiques
   ├── logo.png
   ├── deco.svg
   ├── attention.svg
   └── ia.png
✅ index.html                 → HTML de base
```

### Dépendances
```json
{
  "preact": "^10.25.1",      // Framework UI
  "preact-iso": "^2.11.0",   // Routing (installé manuellement)
  "@tauri-apps/api": "^2",   // API Tauri (nouveau)
  "@tauri-apps/cli": "^2"    // CLI Tauri (nouveau)
}
```

## 🔄 Comment ça fonctionne

### Architecture Tauri

```
┌─────────────────────────────────┐
│   Frontend (Preact + Vite)      │
│   Port: 1420 (dev mode)          │
│   - Votre code UI existant       │
│   - Même composants, même style  │
└──────────────┬──────────────────┘
               │
               │ IPC (Inter-Process Communication)
               │ via @tauri-apps/api
               │
┌──────────────▼──────────────────┐
│   Backend (Rust)                 │
│   - Accès système de fichiers   │
│   - Logique métier native        │
│   - Sécurité et permissions      │
└──────────────────────────────────┘
```

### Processus de build

1. **Mode dev** : `npm run tauri dev`
   - Vite démarre sur le port 1420
   - Rust compile et lance une fenêtre WebView
   - Hot reload actif pour le frontend

2. **Mode prod** : `npm run tauri build`
   - Vite build le frontend (HTML/CSS/JS optimisés)
   - Rust compile en mode release
   - Création d'un exécutable (~5-10 MB)
   - Output : `src-tauri/target/release/glosaurus.exe`

## 🎯 Fonctionnalités disponibles

### ✅ Ce qui fonctionne comme avant
- ✅ Tous vos composants Preact
- ✅ Le routing avec preact-iso
- ✅ Le localStorage pour persister les données
- ✅ Les styles CSS
- ✅ Les images et assets statiques
- ✅ L'ajout et l'export de mots
- ✅ Le modal pour ajouter des mots

### 🆕 Nouvelles capacités avec Tauri

1. **Application de bureau native**
   - Icône dans la barre des tâches
   - Peut être lancée sans navigateur
   - Peut être distribuée comme .exe

2. **Accès au système de fichiers**
```typescript
import { save } from '@tauri-apps/plugin-fs';

// Sauvegarder directement dans le système
await save({
  filters: [{
    name: 'JSON',
    extensions: ['json']
  }]
});
```

3. **Notifications système**
```typescript
import { sendNotification } from '@tauri-apps/plugin-notification';

await sendNotification({
  title: 'Glosaurus',
  body: 'Mot ajouté avec succès!'
});
```

4. **Menus natifs**
   - Menu système
   - Menu contextuel
   - Tray icon (barre système)

5. **Fenêtres multiples**
```typescript
import { Window } from '@tauri-apps/api/window';

const settingsWindow = new Window('settings');
```

## 🔧 Améliorations possibles

### 1. Remplacer l'API fetch par des commandes Rust

**Actuel** (dans `api.ts`) :
```typescript
export async function postJSON(url: string, data: unknown) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}
```

**Avec Tauri** (plus sécurisé) :
```typescript
import { invoke } from '@tauri-apps/api/core';

export async function saveWords(words: WordItem[]) {
    return await invoke('save_words', { words });
}
```

**Backend Rust** :
```rust
#[tauri::command]
fn save_words(words: Vec<Word>) -> Result<String, String> {
    // Sauvegarder localement, envoyer à une API, etc.
    Ok("Saved successfully".to_string())
}
```

### 2. Améliorer l'export JSON avec dialog natif

**Actuel** :
```typescript
// Utilise blob et download
const blob = new Blob([content], { type: 'application/json' });
const url = URL.createObjectURL(blob);
```

**Avec Tauri** :
```typescript
import { save } from '@tauri-apps/plugin-dialog';

const filePath = await save({
    defaultPath: `glossaire-${timestamp}.json`,
    filters: [{
        name: 'JSON',
        extensions: ['json']
    }]
});

if (filePath) {
    await invoke('write_file', { 
        path: filePath, 
        content: JSON.stringify(words, null, 2) 
    });
}
```

### 3. Ajouter un système de backup automatique

```rust
// En Rust, sauvegarder périodiquement
use std::time::Duration;
use tokio::time::interval;

#[tauri::command]
async fn enable_auto_backup() {
    let mut interval = interval(Duration::from_secs(300)); // 5 minutes
    loop {
        interval.tick().await;
        // Sauvegarder les données
    }
}
```

## 🚀 Prochaines étapes recommandées

### Court terme (1-2 heures)
1. ✅ Tester l'application : `npm run tauri dev`
2. ⬜ Personnaliser l'icône de l'app dans `src-tauri/icons/`
3. ⬜ Ajuster le titre et les métadonnées dans `src-tauri/tauri.conf.json`
4. ⬜ Créer un premier build : `npm run tauri build`

### Moyen terme (1 semaine)
1. ⬜ Implémenter un système de sauvegarde avec Tauri
2. ⬜ Ajouter des notifications système
3. ⬜ Créer un menu natif
4. ⬜ Ajouter un raccourci clavier global

### Long terme
1. ⬜ Créer un installeur Windows (.msi)
2. ⬜ Ajouter l'auto-update
3. ⬜ Support macOS et Linux
4. ⬜ Synchronisation cloud optionnelle

## 📦 Distribution

### Créer un installeur
```powershell
cd C:\TestFlet\Tauri
npm run tauri build
```

Fichiers générés dans `src-tauri/target/release/` :
- `glosaurus.exe` - L'exécutable
- `bundle/msi/` - Installeur Windows (si configuré)
- `bundle/nsis/` - Installeur NSIS (si configuré)

### Configuration de l'installeur

Éditez `src-tauri/tauri.conf.json` :
```json
{
  "bundle": {
    "active": true,
    "targets": ["msi", "nsis"],
    "windows": {
      "wix": {
        "language": "fr-FR"
      }
    }
  }
}
```

## 🐛 Problèmes courants et solutions

### Le localStorage ne persiste pas
**Solution** : Tauri utilise un localStorage isolé par défaut. C'est normal et plus sécurisé.

### L'API externe ne fonctionne pas
**Solution** : Ajoutez les permissions dans `tauri.conf.json` :
```json
{
  "permissions": [
    "http:default",
    "http:allow-fetch"
  ]
}
```

### Les images ne s'affichent pas
**Solution** : Vérifiez que les chemins sont relatifs et commencent par `/` :
```tsx
<img src="/logo.png" /> ✅
<img src="logo.png" />  ❌
```

### L'application ne compile pas
1. Vérifier Rust : `rustc --version`
2. Mettre à jour : `rustup update`
3. Nettoyer : `cd src-tauri && cargo clean`
4. Réinstaller : `npm install`

## 📚 Resources supplémentaires

- [Tauri API Documentation](https://tauri.app/v1/api/)
- [Tauri Guides](https://tauri.app/v1/guides/)
- [Tauri Plugins](https://tauri.app/v1/plugins/)
- [Exemples Tauri](https://github.com/tauri-apps/tauri/tree/dev/examples)

## 🎉 Résumé

Votre application Preact fonctionne maintenant comme une application de bureau native ! Vous pouvez :
- ✅ Développer avec hot-reload
- ✅ Utiliser toutes vos fonctionnalités existantes
- ✅ Créer un exécutable Windows
- 🚀 Ajouter des fonctionnalités natives progressivement

Bonne continuation avec Tauri ! 🦖
