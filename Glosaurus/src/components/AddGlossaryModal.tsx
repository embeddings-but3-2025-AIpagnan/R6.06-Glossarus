import { useState, useEffect, useRef } from 'preact/hooks';
import './AddGlossaryModal.css';

interface AddGlossaryModalProps {
    onClose: () => void;
    onAdd: (glossary: { name: string; description: string }) => void;
}

export function AddGlossaryModal({ onClose, onAdd }: AddGlossaryModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    const modalRef = useRef<HTMLDivElement | null>(null);
    const firstInputRef = useRef<HTMLInputElement | null>(null);
    const previouslyFocused = useRef<Element | null>(null);

    useEffect(() => {
        previouslyFocused.current = document.activeElement;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            firstInputRef.current?.focus();
        }, 0);

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
            (previouslyFocused.current as HTMLElement | null)?.focus?.();
        };
    }, []);

    const handleSubmit = (e?: Event) => {
        e?.preventDefault();
        
        let newErrors: { name?: string; description?: string } = {};

        if (!name.trim()) newErrors.name = "Please provide a glossary name !";
        if (!description.trim()) newErrors.description = "Please provide a description !";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onAdd({ name, description });
            setName('');
            setDescription('');
            setErrors({});
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="modal-content" ref={modalRef} onClick={e => e.stopPropagation()}>
                <h2>Create a new glossary</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <label className="name-label">
                        <span>Name</span>
                        <span className="glossary-required">*</span>
                    </label>
                    <input
                        ref={firstInputRef}
                        type="text"
                        className={`input-name ${errors.name ? "input-error" : ""}`}
                        placeholder="Enter Glossary name"
                        value={name}
                        onInput={(e) => {
                            const val = (e.target as HTMLInputElement).value;
                            setName(val);
                            if (errors.name && val.trim() !== "") {
                                setErrors((prev) => ({ ...prev, name: undefined }));
                            }
                        }}
                    />
                    <nav className="attention">
                        {errors.name && (
                            <>
                                <img src="/attention.svg" alt="attention" />
                                <p className="error-text">{errors.name}</p>
                            </>
                        )}
                    </nav>

                    <label className="description-label">
                        <span>Description</span>
                        <span className="glossary-required">*</span>    
                    </label>
                    <textarea
                        className={`textarea-description ${errors.description ? "input-error" : ""}`}
                        placeholder="Provide a brief description of the glossary"
                        value={description}
                        onInput={(e) => {
                            const val = (e.target as HTMLTextAreaElement).value;
                            setDescription(val);
                            if (errors.description && val.trim() !== "") {
                                setErrors((prev) => ({ ...prev, description: undefined }));
                            }
                        }}
                    />
                    <nav className="attention">
                        {errors.description && (
                            <>
                                <img src="/attention.svg" alt="attention" />
                                <p className="error-text">{errors.description}</p>
                            </>
                        )}
                    </nav>

                    <div className="modal-actions">
                        <button type="button" className="close-btn" onClick={onClose}>Close</button>
                        <button type="submit" className="add-btn">Add</button>       
                    </div>
                </form>
            </div>
        </div>
    );
}
