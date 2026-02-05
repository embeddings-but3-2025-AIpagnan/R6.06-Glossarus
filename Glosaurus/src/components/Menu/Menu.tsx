import { useState, useRef, useEffect } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import './Menu.css'
import { AddGlossaryModal } from '../../modals/AddGlossary/AddGlossary'
import { importGlossaryFromFile } from '../../utils/importExport'
import { loadFromStorage, saveToStorage } from '../../utils/storage'
import { Trash2 } from 'lucide-preact'
import { UpdateGlossary } from '../../modals/UpdateGlossary/UpdateGlossary'

interface Glossary {
  name: string
  description: string
  lastModified: string
}

export function Menu() {
  const STORAGE_KEY = 'glossaries'
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [glossaries, setGlossaries] = useState<Glossary[]>(() =>
    loadFromStorage(STORAGE_KEY, [])
  )
  const [editingGlossary, setEditingGlossary] = useState<Glossary | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const { route } = useLocation()
  const tooltipRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tooltip, setTooltip] = useState<{
    text: string
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    console.log('Saving glossaries to storage. Count:', glossaries.length)
    saveToStorage(STORAGE_KEY, glossaries)
    console.log('Glossaries saved successfully')
  }, [glossaries])

  useEffect(() => {
    if (tooltip && tooltipRef.current) {
      tooltipRef.current.style.left = `${tooltip.x}px`
      tooltipRef.current.style.top = `${tooltip.y}px`
    }
  }, [tooltip])

  const handleAddGlossary = (glossary: {
    name: string
    description: string
  }) => {
    console.log('Adding new glossary:', glossary.name)
    const newGlossary: Glossary = {
      ...glossary,
      lastModified: new Date().toLocaleString(),
    }
    setGlossaries([...glossaries, newGlossary])
    setIsModalOpen(false)
    console.log('Glossary added successfully. Total:', glossaries.length + 1)
  }

  const handleFileImport = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    console.log('Starting file import:', file.name)
    try {
      const importedGlossary = await importGlossaryFromFile(file)
      console.log('Glossary imported from file:', importedGlossary.name, 'with', importedGlossary.words.length, 'words')

      const storageKey = `glossary_${importedGlossary.name}`
      saveToStorage(storageKey, importedGlossary.words)
      console.log('Words saved to storage for glossary:', importedGlossary.name)

      const newGlossary: Glossary = {
        name: importedGlossary.name,
        description:
          importedGlossary.description ||
          `Import - ${importedGlossary.words.length} word(s)`,
        lastModified: new Date().toLocaleString(),
      }

      setGlossaries([...glossaries, newGlossary])
      console.log('Glossary added to list. Total:', glossaries.length + 1)
      window.alert(`Glossary "${importedGlossary.name}" imported successfully!`)
    } catch (error) {
      console.error('File import failed:', error)
      window.alert(
        `Error during import: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
    console.log('File import process completed')
  }

  const handleDeleteGlossary = (index: number) => {
    const glossaryToDelete = glossaries[index]
    console.log('Deleting glossary:', glossaryToDelete.name, 'at index:', index)
    if (confirm('Delete this glossary?')) {
      localStorage.removeItem(`glossary_${glossaryToDelete.name}`)
      setGlossaries(glossaries.filter((_, i) => i !== index))
      console.log('Glossary deleted successfully. Total:', glossaries.length - 1)
    } else {
      console.log('Glossary deletion cancelled')
    }
  }

  const handleOpenGlossary = (name: string) => {
    console.log('Opening glossary:', name)
    setGlossaries(
      glossaries.map((g) =>
        g.name === name
          ? { ...g, lastModified: new Date().toLocaleString() }
          : g
      )
    )

    route(`/glossaire/${encodeURIComponent(name)}`)
    console.log('Navigation to glossary page initiated')
  }

  const filteredGlossaries = glossaries.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )
  console.log('Filtered glossaries based on search:', search, 'Results:', filteredGlossaries.length)

  const getWordCount = (glossaryName: string): number => {
    const storageKey = `glossary_${glossaryName}`
    const words = loadFromStorage(storageKey, [])
    return Array.isArray(words) ? words.length : 0
  }

  return (
    <div className="glossaire-page">
      <div className="glossaire-header">
        <nav className="deco">
          <img src="/deco.svg" title="Decoration" alt="Decoration" />
          <h1>My Glossaries</h1>
        </nav>

        <div className="header-buttons">
          <button
            className="import-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <img src="/import.svg" alt="Import icon"/>
            Import
          </button>
          <button className="new-word" onClick={() => setIsModalOpen(true)}>
            Create New Glossary
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.md,.markdown"
        onChange={handleFileImport}
        className="hidden-file-input"
        aria-label="Import glossary file"
        title="Import glossary file"
      />

      <input
        type="text"
        className="search-bar"
        placeholder="Search Glossaries..."
        value={search}
        onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
      />

      <table className="glossaire-table">
        <thead>
          <tr>
            <th>Name</th>
            <th className="Countword"></th>
            <th className="Description">Description</th>
            <th>Last Modified</th>
            <th className="actions-column"></th>
          </tr>
        </thead>
        <tbody>
          {filteredGlossaries.map((g, index) => (
            <tr key={index}>
              <td className="Name" onClick={() => handleOpenGlossary(g.name)}>
                <button
                  type="button"
                  className="text-label"
                  aria-label={`Voir le nom complet: ${g.name}`}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({
                      text: g.name,
                      x: rect.left,
                      y: rect.bottom + 4,
                    })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({
                      text: g.name,
                      x: rect.left,
                      y: rect.bottom + 4,
                    })
                  }}
                  onBlur={() => setTooltip(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      const rect = (e.target as HTMLElement).getBoundingClientRect()
                      setTooltip({
                        text: g.name,
                        x: rect.left,
                        y: rect.bottom + 4,
                      })
                    }
                  }}
                >
                  {g.name}
                </button>
              </td>
              <td>
                <span className="badge-count">
                  {getWordCount(g.name)} word(s)
                </span>
              </td>

              <td
                className="clickable"
                onClick={() => handleOpenGlossary(g.name)}
              >
                <button
                  type="button"
                  className="text-label"
                  aria-label={`Voir la description complète: ${g.description.substring(0, 30)}${g.description.length > 30 ? '...' : ''}`}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({
                      text: g.description,
                      x: rect.left,
                      y: rect.bottom + 4,
                    })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({
                      text: g.description,
                      x: rect.left,
                      y: rect.bottom + 4,
                    })
                  }}
                  onBlur={() => setTooltip(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      const rect = (e.target as HTMLElement).getBoundingClientRect()
                      setTooltip({
                        text: g.description,
                        x: rect.left,
                        y: rect.bottom + 4,
                      })
                    }
                  }}
                >
                  {g.description}
                </button>
              </td>

              <td>{g.lastModified || 'Never'}</td>
              <td className="actions-cell">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingGlossary(g)
                    setIsUpdateModalOpen(true)
                  }}
                  title="Modifier"
                >
                  <img src="/modifier.svg" alt="Modifier" />
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDeleteGlossary(index)}
                  aria-label="Delete glossary"
                  title="Delete glossary"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tooltip && (
        <div className="tooltip-popup" ref={tooltipRef}>
          {tooltip.text}
        </div>
      )}

      {isUpdateModalOpen && editingGlossary && (
        <UpdateGlossary
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          initialData={{
            word: editingGlossary.name,
            definition: editingGlossary.description,
            synonyms: [],
          }}
          onAddWord={(newName, newDescription) => {
            const oldStorageKey = `glossary_${editingGlossary.name}`
            const newStorageKey = `glossary_${newName}`

            if (newName !== editingGlossary.name) {
              const existingWords = loadFromStorage(oldStorageKey, [])
              saveToStorage(newStorageKey, existingWords)
              localStorage.removeItem(oldStorageKey)
            }

            setGlossaries(
              glossaries.map((g) =>
                g.name === editingGlossary.name
                  ? {
                    ...g,
                    name: newName,
                    description: newDescription,
                    lastModified: new Date().toLocaleString(),
                  }
                  : g
              )
            )

            setIsUpdateModalOpen(false)
          }}
        />
      )}

      {isModalOpen && (
        <AddGlossaryModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddGlossary}
        />
      )}
    </div>
  )
}
