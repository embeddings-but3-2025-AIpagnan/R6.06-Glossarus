/**
 * DEPRECATED: Ce fichier est conservé pour la compatibilité rétroactive
 *
 * Les nouvelles implémentations doivent utiliser:
 * - GlossaryService pour la logique métier des glossaires
 * - WordService pour la logique métier des mots
 * - GlossaryRepository pour l'accès aux données
 *
 * @see src/application/services/GlossaryService.ts
 * @see src/application/services/WordService.ts
 * @see src/domain/repositories/GlossaryRepository.ts
 */

export type { Glossary } from './types/index'

// Réexporte les fonctions pures pour la compatibilité
import type { Glossary } from './types/index'

export function createGlossary(
  glossaries: Glossary[],
  data: { name: string; description: string },
  now = new Date()
): Glossary[] {
  console.log('Creating new glossary:', data.name)
  const newGlossaries = [
    ...glossaries,
    {
      ...data,
      lastModified: now.toLocaleString(),
    },
  ]
  console.log('Glossary created successfully. Total glossaries:', newGlossaries.length)
  return newGlossaries
}

export function removeGlossary(
  glossaries: Glossary[],
  index: number
): Glossary[] {
  console.log('Removing glossary at index:', index)
  const newGlossaries = glossaries.filter((_, i) => i !== index)
  console.log('Glossary removed successfully. Total glossaries:', newGlossaries.length)
  return newGlossaries
}

export function updateGlossary(
  glossaries: Glossary[],
  oldName: string,
  newName: string,
  newDescription: string,
  now = new Date()
): Glossary[] {
  console.log('Updating glossary:', oldName, '->', newName)
  const newGlossaries = glossaries.map((g) =>
    g.name === oldName
      ? {
          ...g,
          name: newName,
          description: newDescription,
          lastModified: now.toLocaleString(),
        }
      : g
  )
  console.log('Glossary updated successfully')
  return newGlossaries
}

export function filterGlossaries(
  glossaries: Glossary[],
  search: string
): Glossary[] {
  console.log('Filtering glossaries with search term:', search)
  const filtered = glossaries.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )
  console.log('Found', filtered.length, 'glossaries matching search')
  return filtered
}
