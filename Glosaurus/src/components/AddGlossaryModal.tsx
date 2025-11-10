import { useState } from 'preact/hooks';
import './AddGlossaryModal.css';

interface AddGlossaryModalProps {
    onClose: () => void;
    onAdd: (glossary: { name: string; description: string }) => void;
}

export function AddGlossaryModal({ onClose, onAdd }: AddGlossaryModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return; // éviter les champs vides
        onAdd({ name, description });
        setName('');
        setDescription('');
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Create a new glossary</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <label>
                        Name
                        <input
                            type="text"
                            className="input-name"
                            placeholder="Enter Glossary name"
                            value={name}
                            onInput={(e) => setName((e.target as HTMLInputElement).value)}
                        />
                    </label>
                    <label>
                        Description
                        <input
                            type="text"
                            className="input-description"
                            placeholder="Provide a brief description of the glossary"
                            value={description}
                            onInput={(e) => setDescription((e.target as HTMLInputElement).value)}
                        />
                    </label>
                    <div className="modal-actions">
                        <button type="button" className="close-btn" onClick={onClose}>Close</button>
                        <button type="submit" className="add-btn">Add</button>       
                    </div>
                </form>
            </div>
        </div>
    );
}
