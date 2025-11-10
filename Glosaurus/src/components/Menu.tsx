import { useState } from 'preact/hooks';
import './Menu.css';
import { AddGlossaryModal } from './AddGlossaryModal';

interface Glossary {
    name: string;
    description: string;
}

export function Menu() {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [glossaries, setGlossaries] = useState<Glossary[]>([]);

    const handleAddGlossary = (newGlossary: Glossary) => {
        setGlossaries([...glossaries, newGlossary]);
        setIsModalOpen(false);
    };

    return (
        <div className="glossaire">
            <div className="glossaire-header">
                <nav className="deco">
                    <img src="/deco.svg" title="Decoration" alt="Decoration" />
                    <h1>My Glossaries</h1>
                </nav>

                <button className="new-word" onClick={() => setIsModalOpen(true)}>
                    Add New Glossary
                </button>
            </div>

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
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {glossaries.map((g, index) => (
                        <tr key={index}>
                            <td>{g.name}</td>
                            <td>{g.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <AddGlossaryModal 
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddGlossary} // passe la fonction au modal
                />
            )}
        </div>
    );
}
