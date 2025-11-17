import { useEffect, useRef, useState } from "preact/hooks";
import "./AddWordModal.css";
import { postJSON } from "../utils/api";

interface AddWordModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAddWord: (word: string, definition: string, synonyms: string[]) => void;
	initialData?: {
		word: string;
		definition: string;
		synonyms: string[];
	} | null;
}



export function SynonymSuggestion({
  word,
  userSynonyms,
  onAddSynonym,
}: {
  word: string
  userSynonyms: string[]
  onAddSynonym: (synonym: string) => void
}) {
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [visibleSynonyms, setVisibleSynonyms] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
    if (!word || word.trim() === "") {
      setSynonyms([]);
      setVisibleSynonyms([]);
      setStartIndex(0);
      return;
    }

   
    setSynonyms([]);
    setVisibleSynonyms([]);
    setStartIndex(0);
    setLoading(true);

    const timeout = setTimeout(() => {
      console.log("start fetch");
      postJSON("http://127.0.0.1:8000/synonym/getSynonym", {
        word: word.trim(),
        synonyms: userSynonyms || [],
      })
        .then((data: any) => {
			console.log("Réponse API :", data);
			if (data?.synonyms && Array.isArray(data.synonyms) && data.synonyms.length > 0) {
				const uniqueSynonyms: string[] = Array.from(new Set(data.synonyms as string[]));
				setSynonyms(uniqueSynonyms);
				setVisibleSynonyms(uniqueSynonyms.slice(0, 5));
				setStartIndex(0);
			} else {
				setSynonyms([]);
				setVisibleSynonyms([]);
			}
			})
        .catch((err) => {
          console.error("Erreur API :", err);
          setSynonyms([]);
          setVisibleSynonyms([]);
        })
        .finally(() => {
          console.log("fetch terminé");
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [word, userSynonyms]);

  const handleReload = () => {
    if (synonyms.length <= 5) return;
    const nextIndex = (startIndex + 5) % synonyms.length;
    const nextSlice = [
      ...synonyms.slice(nextIndex, nextIndex + 5),
      ...synonyms.slice(0, Math.max(0, (nextIndex + 5) - synonyms.length)),
    ];
    setVisibleSynonyms(nextSlice);
    setStartIndex(nextIndex);
  };

  return (
    <div className="ai-suggestion">
      <p>
        AI Suggestions:{" "}
        {loading ? (
          "Chargement..."
        ) : visibleSynonyms.length > 0 ? (
          <>
            {visibleSynonyms.map((syn, i) => (
              <span
                key={i}
                className="clickable-synonym"
                onClick={() => onAddSynonym(syn)}
                title="Cliquer pour ajouter ce synonyme"
              >
                {syn}
                {i < visibleSynonyms.length - 1 && ", "}
              </span>
            ))}
          </>
        ) : (
          "No suggestion found"
        )}
      </p>

      {!loading && synonyms.length > 5 && (
        <button
          onClick={handleReload}
          className="reload-btn"
          title="Afficher d'autres synonymes"
        >
          🔁
        </button>
      )}
    </div>
  );
}

export default SynonymSuggestion;


export function AddWordModal({ isOpen, onClose, onAddWord, initialData }: AddWordModalProps) {
	const [word, setWord] = useState(initialData?.word || "");
	const [definition, setDefinition] = useState(initialData?.definition || "");
	const [synonyms, setSynonyms] = useState<string[]>(initialData?.synonyms || []);

	const [currentSynonym, setCurrentSynonym] = useState("");
	const [errors, setErrors] = useState<{ 
		word?: string; 
		definition?: string; 
		synonyms?: string; 
		doublons?: string; 
		doublonsWord?: string 
	}>({});


	const modalRef = useRef<HTMLDivElement | null>(null);
	const firstInputRef = useRef<HTMLInputElement | null>(null);
	const previouslyFocused = useRef<Element | null>(null);

	useEffect(() => {
	if (initialData) {
		setWord(initialData.word);
		setDefinition(initialData.definition);
		setSynonyms(initialData.synonyms);
	} else {
		setWord("");
		setDefinition("");
		setSynonyms([]);
	}
}, [initialData, isOpen]);

	useEffect(() => {
		if (isOpen) {
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
		}
	}, [isOpen]);

	useEffect(() => {
		const lowerWord = word.trim().toLowerCase();

		const index = synonyms.findIndex(
			syn => syn.trim().toLowerCase() === lowerWord
		);

		if (index !== -1) {
			handleRemoveSynonym(index);

			setErrors(prev => ({
				...prev,
				doublonsWord: "You can't add a synonym that is the same as the word"
			}));
		} else {
			setErrors(prev => ({
				...prev,
				doublons: undefined
			}));
		}
	}, [word, synonyms]);


		
	const CheckSynonymNotEqualToWord = (syn: string, index?: number): boolean => {
		const lowerWord = word.trim().toLowerCase();
		const lowerSyn = syn.trim().toLowerCase();

		if (lowerSyn === lowerWord) {
			setErrors(prev => ({
				...prev,
				definition: prev.definition,
				word: prev.word,
				synonyms: "The synonym can't be the same as the word"
			}));
			if (index !== undefined) {
				handleRemoveSynonym(index);
			}
			return false;
		}
		
		setErrors(prev => ({ ...prev, synonyms: undefined }));
		return true;
	};

	const handleAddSynonym = (e: any) => {
		if (e.key === "Enter" && currentSynonym.trim() !== "") {
			e.preventDefault();

			const syn = currentSynonym.trim().toLowerCase();

			if (!CheckSynonymNotEqualToWord(syn)) {
				return;
			}

			if (synonyms.some(s => s.toLowerCase() === syn)) {
				setErrors(prev => ({
					...prev,
					doublons: "This synonym has already been added"
				}));
					setCurrentSynonym("");
					return;
			}

			setTimeout(() => {
				setErrors(prev => ({ ...prev, doublons: undefined }));
			}, 5000);

			setSynonyms([...synonyms, syn]);
			setCurrentSynonym("");
		}
	};


	const handleRemoveSynonym = (index: number) => {
		setSynonyms(synonyms.filter((_, i) => i !== index));
	};

	const handleSubmit = () => {
		let newErrors: { word?: string; definition?: string } = {};

		if (!word.trim()) newErrors.word = "Please provide a word !";
		if (!definition.trim()) newErrors.definition = "Please provide a description of the word !";

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			onAddWord(word, definition, synonyms);
			setWord("");
			setDefinition("");
			setSynonyms([]);
			setErrors({});
			onClose();
		}
	};



	if (!isOpen) return null;

	return (
		<div className="modal-overlay" role="dialog" aria-modal="true">
			<div className="modal" ref={modalRef}>
				<h2>Add a New Word</h2>

				<label className={"word-label"}>
					<span>Word</span>
					<span className="required">*</span>
				</label>
				<input
					ref={firstInputRef}
					type="text"
					className={`word-area ${errors.word ? "input-error" : ""}`}
					placeholder="Enter the word"
					value={word}
					onInput={(e) => {
						const val = (e.target as HTMLInputElement).value;
						setWord(val);
						if (errors.word && val.trim() !== "") {
							setErrors((prev) => ({ ...prev, word: undefined }));
						}
					}}
					onDragOver={(e) => e.preventDefault()} // permet le drop
					onDrop={(e) => {
						e.preventDefault();
						const dt = e.dataTransfer;
						if (!dt) return;
						const droppedSyn = dt.getData("text/plain"); // récupérer le synonyme
						if (droppedSyn) {
							setWord(droppedSyn); // remplacer le champ word
							// retirer le synonyme de la liste si besoin
							const index = synonyms.findIndex(s => s === droppedSyn);
							if (index !== -1) handleRemoveSynonym(index);
						}
					}}
				/>


				<nav className="attention">
					{errors.word && (
						<>
							<img src="/attention.svg" alt="attention" />
							<p className="error-text">{errors.word}</p>
						</>
					)}
				</nav>

				<label className="definition-label">
					<span>Definition</span>
					<span className="required">*</span>
					
				</label>
				<textarea
					className={`definition-area ${errors.definition ? "input-error" : ""}`}
					placeholder="Enter the definition"
					value={definition}
					onInput={(e) => {
						const val = (e.target as HTMLTextAreaElement).value;
						setDefinition(val);
						if (errors.definition && val.trim() !== "") {
							setErrors((prev) => ({ ...prev, definition: undefined }));
						}
					}}
				/>

				<nav className="attention">
					{errors.definition && (
						<>
							<img src="/attention.svg" alt="attention" />
							<p className="error-text">{errors.definition}</p>
						</>
					)}
				</nav>

				<label className={"synonym-label"}>Synonyms (Optional)</label>
				<input
					type="text"
					placeholder="Press enter to add a synonym"
					value={currentSynonym}
					onInput={(e) => {
						const value = (e.target as HTMLInputElement).value.toLowerCase(); 
						setCurrentSynonym(value);
					}}
					onKeyDown={handleAddSynonym}
					onFocus={() => {
						setErrors(prev => ({ ...prev, doublonsWord: undefined, synonyms: undefined }));
					}}
					/>

				{errors.synonyms && (
					<nav className="attention">
						<img src="/attention.svg" alt="attention" />
						<p className="error-text">{errors.synonyms}</p>
					</nav>
				)}
				{errors.doublons && (
					<nav className="attention">
						<img src="/attention.svg" alt="attention" />
						<p className="error-text">{errors.doublons}</p>
					</nav>
				)}
				{errors.doublonsWord && (
					<nav className="attention">
						<img src="/attention.svg" alt="attention" />
						<p className="error-text">{errors.doublonsWord}</p>
					</nav>
				)}

				<div className="synonym-list">
					{synonyms.map((syn, i) => (
						<span
							key={i}
							className="tag"
							draggable={true}
							onDragStart={(e) => {
								const dt = e.dataTransfer;
								if (!dt) return;
								dt.setData("text/plain", syn);
							}}
						>
							<button
								className="remove-btn"
								onClick={() => handleRemoveSynonym(i)}
								aria-label="remove synonym"
							>
								×
							</button>
							{syn}
						</span>
					))}

				</div>


				<nav>
					<img src="/ia.png" className="logo-ia" title="AI Suggestions" />
					<SynonymSuggestion
					word={word}
					userSynonyms={synonyms}
					onAddSynonym={(syn: string) => {
						if (!synonyms.includes(syn)) {
						setSynonyms([...synonyms, syn]);
						}
					}}
					/>

				</nav>
				<div className="modal-actions">
					<button className="cancel" onClick={onClose}>Cancel</button>
					<button className="add" onClick={handleSubmit}>Add Word</button>
				</div>
			</div>
		</div>
	);
}
