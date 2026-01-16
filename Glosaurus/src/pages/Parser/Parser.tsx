import { useRef, useState } from 'preact/hooks'
import './Parser.css'

export function Parser() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>('Aucun fichier sélectionné')

  const handleFileChange = () => {
    const files = fileInputRef.current?.files
    if (files && files.length > 0) {
      setFileName(files[0].name)
    }
  }

  return (
    <div className="parser">
      <div className="parser-header">
        <nav className="deco">
            <img src="/deco.svg" title="Decoration" alt="Decoration" />
            <h1>Parser</h1>
        </nav>

        <div className="header-buttons-parser">
            <button
            className="import-btn-parser"
            onClick={() => fileInputRef.current?.click()}
            >
            <img src="/import.svg" alt="Import icon" />
            Import
            </button>

            <button className="back-btn">
            Back
            </button>
        </div>

        <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileChange}
        />
        </div>
     <h1>Terms found in {fileName}</h1>
     <table className="glossaire-table">
        <thead>
          <tr>
            <th>Terms</th>
            <th>Occurence</th>cd
          </tr>
        </thead>
    </table>

        
    </div>
  )
}
