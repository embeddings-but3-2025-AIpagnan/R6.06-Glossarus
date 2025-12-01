import { useState } from "preact/hooks";
import type { Glossary } from "../utils/importExport";
import {
    downloadGlossaryAsJSON,
    downloadGlossaryAsMarkdown,
    exportToJSON,
    exportToMarkdown,
} from "../utils/importExport";
import "./ExportModal.css";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    glossary: Glossary;
}

export function ExportModal({ isOpen, onClose, glossary }: ExportModalProps) {
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [previewFormat, setPreviewFormat] = useState<'JSON' | 'Markdown' | null>(null);

    if (!isOpen) return null;

    const handleExportJSON = async () => {
        setIsExporting(true);
        setError('');
        setSuccess('');
        try {
            await downloadGlossaryAsJSON(glossary);
            setSuccess('Glossaire exporté en JSON avec succès !');
            setTimeout(() => {
                setSuccess('');
                onClose();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'export');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportMarkdown = async () => {
        setIsExporting(true);
setError('');
        setSuccess('');
        try {
            await downloadGlossaryAsMarkdown(glossary);
            setSuccess('Glossaire exporté en Markdown avec succès !');
            setTimeout(() => {
                setSuccess('');
                onClose();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'export');
        } finally {
            setIsExporting(false);
        }
    };

    const handlePreviewJSON = () => {
        setPreviewContent(exportToJSON(glossary));
        setPreviewFormat('JSON');
    };

    const handlePreviewMarkdown = () => {
        setPreviewContent(exportToMarkdown(glossary));
        setPreviewFormat('Markdown');
    };

    const handleClosePreview = () => {
        setPreviewContent(null);
        setPreviewFormat(null);
    };

    return (
        <div class="export-modal-overlay" onClick={onClose}>
            <div class="export-modal-content export-modal" onClick={(e) => e.stopPropagation()}>
                <div class="export-modal-main">
                    
                    <h2>Export your Glossary</h2>

                    <div class="export-modal-body">
                        {error && <div class="alert alert-error">{error}</div>}
                        {success && <div class="alert alert-success">{success}</div>}

                        {previewContent ? (
                            <div class="preview-section">
                                <h3>Preview as {previewFormat}</h3>
                                <pre class="preview-content"><code>{previewContent}</code></pre>
                                <button class="btn btn-secondary" onClick={handleClosePreview}>Close Preview</button>
                            </div>
                        ) : (
                            <>
                                <p class="section-description">
                                    Export your glossary "<strong>{glossary.name}</strong>" containing <strong>{glossary.words.length}</strong> word(s).
                                </p>
                                
                                <div class="export-options">
                                        <button 
                                            class="btn btn-primary"
                                            onClick={handleExportJSON}
                                            disabled={isExporting}
                                        >
                                            {isExporting ? 'Exporting…' : 'Export as JSON'}
                                        </button>

                                        <button 
                                            class="btn btn-primary"
                                            onClick={handleExportMarkdown}
                                            disabled={isExporting}
                                        >
                                            {isExporting ? 'Exporting…' : 'Export as Markdown'}
                                        </button>
                                </div>
                                <div class="preview-options">
                                    <button
                                        class="btn btn-secondary"
                                        onClick={handlePreviewJSON}
                                        disabled={isExporting}
                                    >
                                        JSON File Preview
                                    </button>
                                    <button
                                        class="btn btn-secondary"
                                        onClick={handlePreviewMarkdown}
                                        disabled={isExporting}
                                    >
                                        Markdown File Preview
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div class="export-modal-action">
                    <button class="close-btn" onClick={onClose}>Cancel</button>
                </div>

            </div>
        </div>
    );
}
