import { render, screen, fireEvent } from '@testing-library/preact'
import { Menu } from '../src/components/Menu/Menu'

// Mock du localStorage
beforeEach(() => {
  localStorage.clear()
})

test('affiche le titre', () => {
  render(<Menu />)
  expect(screen.getByText('My Glossaries')).toBeInTheDocument()
})

test('ajouter un glossary met à jour la liste', async () => {
  render(<Menu />)

  fireEvent.click(screen.getByText('Create New Glossary'))

  fireEvent.input(screen.getByPlaceholderText('Enter Glossary name'), {
    target: { value: 'TestGlossary' },
  })

  fireEvent.input(
    screen.getByPlaceholderText('Provide a brief description of the glossary'),
    { target: { value: 'Ma description' } }
  )

  fireEvent.click(screen.getByText('Add'))

  expect(await screen.findByText('TestGlossary')).toBeInTheDocument()
})
