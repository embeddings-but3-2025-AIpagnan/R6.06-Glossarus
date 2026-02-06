// Simple localStorage helpers with safe fallbacks.
export function loadFromStorage<T>(key: string, fallback: T): T {
    console.log('Loading data from storage with key:', key)
    try {
        const raw = localStorage.getItem(key);
        const result = raw ? (JSON.parse(raw) as T) : fallback;
        console.log('Successfully loaded data from storage for key:', key)
        return result;
    } catch {
        console.warn('Failed to load data from storage for key:', key, 'Returning fallback')
        return fallback;
    }
}

export function saveToStorage<T>(key: string, data: T): void {
    console.log('Saving data to storage with key:', key, 'Data length:', JSON.stringify(data).length)
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log('Data saved successfully to storage for key:', key)
    } catch (error) {
        console.error('Failed to save data to storage for key:', key, 'Error:', error)
        // ignore (quota, private mode...)
    }
}

export function clearStorage(key: string): void {
    console.log('Clearing storage for key:', key)
    try {
        localStorage.removeItem(key);
        console.log('Storage cleared successfully for key:', key)
    } catch (error) {
        console.error('Failed to clear storage for key:', key, 'Error:', error)
        // ignore
    }
}

export const DEFAULT_STORAGE_KEY = 'glossaire_words';
