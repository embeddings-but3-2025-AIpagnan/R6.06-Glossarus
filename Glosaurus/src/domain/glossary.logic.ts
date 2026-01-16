export interface Glossary {
  name: string
  description: string
  lastModified: string
}

export function createGlossary(
  glossaries: Glossary[],
  data: { name: string; description: string },
  now = new Date()
): Glossary[] {
  return [
    ...glossaries,
    {
      ...data,
      lastModified: now.toLocaleString(),
    },
  ]
}

export function removeGlossary(
  glossaries: Glossary[],
  index: number
): Glossary[] {
  return glossaries.filter((_, i) => i !== index)
}

export function updateGlossary(
  glossaries: Glossary[],
  oldName: string,
  newName: string,
  newDescription: string,
  now = new Date()
): Glossary[] {
  return glossaries.map((g) =>
    g.name === oldName
      ? {
          ...g,
          name: newName,
          description: newDescription,
          lastModified: now.toLocaleString(),
        }
      : g
  )
}

export function filterGlossaries(
  glossaries: Glossary[],
  search: string
): Glossary[] {
  return glossaries.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )
}
