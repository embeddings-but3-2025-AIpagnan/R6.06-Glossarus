/**
 * Utility functions for importing and exporting glossaries
 * Supports JSON and Markdown formats
 */

// Import Tauri APIs (will be undefined in web browser)
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

export interface WordItem {
    word: string;
    definition: string;
    synonyms: string[];
}

export interface Glossary {
    name: string;
    description?: string;
    words: WordItem[];
}

/**
 * Export glossary to JSON format
 */
export function exportToJSON(glossary: Glossary): string {
    return JSON.stringify(glossary, null, 2);
}

/**
 * Export glossary to Markdown format (table format)
 */
export function exportToMarkdown(glossary: Glossary): string {
    // Helper function to escape pipe characters in table cells
    const escapeCell = (text: string): string => {
        return text.replaceAll('|', '\\|');
    };
    
    let markdown = `# ${glossary.name}\n`;
    
    // Add description as subtitle (### format)
    if (glossary.description) {
        markdown += `### ${glossary.description}\n\n`;
    } else {
        markdown += `### Glossary\n\n`;
    }
    
    // Table header
    markdown += `| Word | Definition | Synonyms |\n`;
    markdown += `| --- | --- | --- |\n`;
    
    // Table rows
    glossary.words.forEach((word) => {
        const synonymsText = word.synonyms && word.synonyms.length > 0 
            ? word.synonyms.join(', ') 
            : '_None_';
        markdown += `| ${escapeCell(word.word)} | ${escapeCell(word.definition)} | ${escapeCell(synonymsText)} |\n`;
    });

    return markdown;
}

/**
 * Import glossary from JSON string
 * @throws Error if JSON is invalid or missing required fields
 */
export function importFromJSON(jsonString: string): Glossary {
    console.log('Starting JSON import process')
    try {
        const data = JSON.parse(jsonString);
        console.log('JSON parsed successfully')

        if (!data.name || typeof data.name !== 'string') {
            throw new Error('Le glossaire doit contenir un champ "name" (string)');
        }

        if (!Array.isArray(data.words)) {
            throw new Error('Le glossaire doit contenir un champ "words" (array)');
        }

        // Validate each word
        data.words.forEach((word: unknown, index: number) => {
            if (typeof word !== 'object' || word === null) {
                throw new Error(`Mot ${index + 1} doit être un objet`);
            }
            const wordObj = word as Record<string, unknown>;
            if (!wordObj.word || typeof wordObj.word !== 'string') {
                throw new Error(`Mot ${index + 1}: le champ "word" est requis (string)`);
            }
            if (!wordObj.definition || typeof wordObj.definition !== 'string') {
                throw new Error(`Mot ${index + 1}: le champ "definition" est requis (string)`);
            }
            if (!Array.isArray(wordObj.synonyms)) {
                throw new Error(`Mot ${index + 1}: le champ "synonyms" doit être un tableau`);
            }
        });

        console.log('JSON validation passed. Imported glossary:', data.name, 'with', data.words.length, 'words')
        return data as Glossary;
    } catch (error) {
        console.error('JSON import failed:', error)
        if (error instanceof SyntaxError) {
            throw new Error('Format JSON invalide');
        }
        throw error;
    }
}

/**
 * Import glossary from Markdown string
 * Parses markdown formatted glossaries
 * @throws Error if markdown format is invalid
 */
export function importFromMarkdown(markdownString: string): Glossary {
    console.log('Starting Markdown import process')
    const lines = markdownString.split('\n');
    console.log('Markdown file split into', lines.length, 'lines')

    const glossaryName = extractH1(markdownString);
    const description = extractH3(markdownString);
    const words = parseTable(lines);

    if (words.length === 0) {
        throw new Error('No words found in Markdown file');
    }

    console.log('Markdown import completed. Imported glossary:', glossaryName, 'with', words.length, 'words')
    return {
        name: glossaryName,
        description,
        words
    };
}

function extractH1(markdown: string): string {
    const match = markdown.match(/^# (?=(\s+))\1([^\n\r]+?)$/m);
    return match ? match[1].trim() : 'Imported Glossary';
}

function extractH3(markdown: string): string | undefined {
    const match = markdown.match(/^###\s+(.+)$/m);
    if (!match) return;

    const desc = match[1].trim();
    return desc && desc !== 'Glossary' ? desc : undefined;
}

function parseTable(lines: string[]): WordItem[] {
    const words: WordItem[] = [];
    let inTable = false;

    for (const rawLine of lines) {
        const line = rawLine.trim();

        if (isTableHeader(line)) {
            inTable = true;
            continue;
        }

        if (isSeparator(line)) continue;

        if (inTable && isTableRow(line)) {
            const item = parseRow(line);
            if (item) words.push(item);
        }
    }

    return words;
}

function isTableHeader(line: string): boolean {
    return line.startsWith('| Word') || line.startsWith('| Mot');
}

function isSeparator(line: string): boolean {
    return line.startsWith('| ---');
}

function isTableRow(line: string): boolean {
    return line.startsWith('|');
}

function parseRow(line: string): WordItem | null {
    const cells = line
        .split(/(?<!\\)\|/)
        .map(c => c.trim())
        .filter(Boolean)
        .map(c => c.replaceAll('\\|', '|'));

    if (cells.length < 3) return null;

    const [word, definition, synonymsText] = cells;

    return {
        word,
        definition,
        synonyms: parseSynonyms(synonymsText)
    };
}

function parseSynonyms(text: string): string[] {
    if (!text || text === '_None_' || text === '_Aucun_') {
        return [];
    }

    return text
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
}


/**
 * Download a file to the user's computer
 * Compatible with both web browsers and Tauri applications
 */
export async function downloadFile(content: string, filename: string, mimeType: string): Promise<void> {
    // Check if we're running in Tauri by trying to use the API
    try {
        // Try to use Tauri API
        const filePath = await save({
            defaultPath: filename,
            filters: mimeType === 'application/json' 
                ? [{ name: 'JSON', extensions: ['json'] }]
                : [{ name: 'Markdown', extensions: ['md'] }]
        });
        
        if (filePath) {
            // Write file to selected location
            await writeTextFile(filePath, content);
        }
    } catch (error) {
        // If Tauri API is not available, fallback to browser download
        console.log('Tauri not available, using browser download');
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

/**
 * Export and download glossary as JSON
 */
export async function downloadGlossaryAsJSON(glossary: Glossary): Promise<void> {
    const json = exportToJSON(glossary);
    const filename = `${glossary.name.replaceAll(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    await downloadFile(json, filename, 'application/json');
}

/**
 * Export and download glossary as Markdown
 */
export async function downloadGlossaryAsMarkdown(glossary: Glossary): Promise<void> {
    const markdown = exportToMarkdown(glossary);
    const filename = `${glossary.name.replaceAll(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    await downloadFile(markdown, filename, 'text/markdown');
}

/**
 * Read file content from File object
 */
export function readFileContent(file: File): Promise<string> {
    console.log('Reading file content:', file.name, 'Size:', file.size, 'bytes')
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (typeof content === 'string') {
                console.log('File read successfully. Content length:', content.length)
                resolve(content);
            } else {
                reject(new Error('Impossible de lire le fichier'));
            }
        };
        reader.onerror = () => {
            console.error('Error reading file:', file.name)
            reject(new Error('Erreur lors de la lecture du fichier'));
        };
        reader.readAsText(file);
    });
}

/**
 * Import glossary from file
 * Automatically detects format based on file extension
 */
export async function importGlossaryFromFile(file: File): Promise<Glossary> {
    console.log('Starting file import process for:', file.name)
    const content = await readFileContent(file);
    const extension = file.name.split('.').pop()?.toLowerCase();
    console.log('Detected file extension:', extension)

    if (extension === 'json') {
        console.log('Processing as JSON file')
        return importFromJSON(content);
    } else if (extension === 'md' || extension === 'markdown') {
        console.log('Processing as Markdown file')
        return importFromMarkdown(content);
    } else {
        console.error('Unsupported file format:', extension)
        throw new Error('Format de fichier non supporté. Utilisez .json ou .md');
    }
}
