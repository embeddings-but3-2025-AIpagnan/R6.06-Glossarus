/// <reference types="vitest" />

import {
  createGlossary,
  removeGlossary,
  updateGlossary,
  filterGlossaries,
} from '../domain/glossary.logic'

test('ajoute un glossary', () => {
  const result = createGlossary([], { name: 'Test', description: 'Desc' }, new Date('2024'))
  expect(result).toHaveLength(1)
})

test('supprime un glossary', () => {
  const result = removeGlossary([{ name: 'A', description: '', lastModified: '' }], 0)
  expect(result).toHaveLength(0)
})

test('met à jour un glossary', () => {
  const result = updateGlossary(
    [{ name: 'Old', description: 'x', lastModified: '' }],
    'Old',
    'New',
    'y',
    new Date('2024')
  )

  expect(result[0].name).toBe('New')
})

test('filtre les glossaries', () => {
  const result = filterGlossaries(
    [{ name: 'JavaScript', description: '', lastModified: '' }],
    'java'
  )
  expect(result).toHaveLength(1)
})
