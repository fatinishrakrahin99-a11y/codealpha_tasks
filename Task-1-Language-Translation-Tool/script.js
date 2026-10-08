// DOM Elements
const sourceText = document.getElementById('source-text');
const translatedText = document.getElementById('translated-text');
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const translateBtn = document.getElementById('translate-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const swapBtn = document.getElementById('swap-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const speakBtn = document.getElementById('speak-btn');
const charCount = document.getElementById('char-count');
const errorMsg = document.getElementById('error-msg');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Translation API
const API_URL = 'https://api.mymemory.translated.net/get';

// Load history on page load
loadHistory();

// Character counter
sourceText.addEventListener('input', () => {
    const count = sourceText.value.length;
    charCount.textContent = `${count} / 5000`;
});

// Clear input
clearBtn.addEventListener('click', () => {
    sourceText.value = '';
    translatedText.value = '';
    charCount.textContent = '0 / 5000';
    hideError();
});

// Swap languages
swapBtn.addEventListener('click', () => {
    const tempLang = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = tempLang;

    const tempText = sourceText.value;
    sourceText.value = translatedText.value;
    translatedText.value = tempText;
});

// Translate
translateBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();

    if (!text) {
        showError('Please enter text to translate');
        return;
    }

    if (sourceLang.value === targetLang.value) {
        showError('Source and target languages must be different');
        return;
    }

    await translate(text, sourceLang.value, targetLang.value);
});

// Enter key to translate
sourceText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        translateBtn.click();
    }
});

// Translation function
async function translate(text, from, to) {
    setLoading(true);
    hideError();

    try {
        const url = `${API_URL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Translation service unavailable');
        }

        const data = await response.json();

        if (data.responseStatus !== 200) {
            throw new Error(data.responseDetails || 'Translation failed');
        }

        const translation = data.responseData.translatedText;
        translatedText.value = translation;

        // Save to history
        saveToHistory(text, translation, from, to);

    } catch (error) {
        showError(`Error: ${error.message}. Please try again.`);
        translatedText.value = '';
    } finally {
        setLoading(false);
    }
}

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    const text = translatedText.value;

    if (!text) {
        showError('No translation to copy');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = '✓';
        setTimeout(() => {
            copyBtn.textContent = '📋';
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
});

// Text to speech
speakBtn.addEventListener('click', () => {
    const text = translatedText.value;

    if (!text) {
        showError('No translation to speak');
        return;
    }

    if (!('speechSynthesis' in window)) {
        showError('Text-to-speech not supported in your browser');
        return;
    }

    const targetCode = targetLang.value;

    // Check if Bengali or Arabic
    if (targetCode === 'bn' || targetCode === 'ar') {
        showError('Bengali/Arabic voice unavailable');
        return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Get available voices
    let voices = speechSynthesis.getVoices();

    const speakText = () => {
        voices = speechSynthesis.getVoices();

        const utterance = new SpeechSynthesisUtterance(text);

        // Map to full locale codes
        const langMap = {
            'zh': 'zh-CN',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'hi': 'hi-IN',
            'en': 'en-US',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT',
            'pt': 'pt-BR',
            'ru': 'ru-RU'
        };

        const fullLocale = langMap[targetCode] || targetCode;
        utterance.lang = fullLocale;
        utterance.rate = 0.9;

        // Find best matching voice
        let selectedVoice = voices.find(v => v.lang === fullLocale) ||
                           voices.find(v => v.lang.startsWith(targetCode + '-')) ||
                           voices.find(v => v.lang.startsWith(targetCode));

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        speechSynthesis.speak(utterance);
    };

    // Handle voice loading
    if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
            speakText();
        };
    } else {
        speakText();
    }
});

// History management
function saveToHistory(sourceText, translatedText, fromLang, toLang) {
    let history = JSON.parse(localStorage.getItem('translationHistory') || '[]');

    const entry = {
        id: Date.now(),
        source: sourceText,
        translation: translatedText,
        from: fromLang,
        to: toLang,
        timestamp: new Date().toISOString()
    };

    history.unshift(entry);

    // Keep only last 10
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    localStorage.setItem('translationHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');

    if (history.length === 0) {
        historyList.innerHTML = '<p class="no-history">No translation history yet</p>';
        return;
    }

    historyList.innerHTML = history.map(entry => `
        <div class="history-item" data-id="${entry.id}">
            <div class="history-item-header">
                <span class="history-lang">${entry.from.toUpperCase()} → ${entry.to.toUpperCase()}</span>
                <span class="history-time">${formatTime(entry.timestamp)}</span>
            </div>
            <div class="history-text">
                <strong>${truncate(entry.source, 60)}</strong><br>
                ${truncate(entry.translation, 60)}
            </div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const entry = history.find(e => e.id === id);
            if (entry) {
                sourceText.value = entry.source;
                translatedText.value = entry.translation;
                sourceLang.value = entry.from;
                targetLang.value = entry.to;
                charCount.textContent = `${entry.source.length} / 5000`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Clear all translation history?')) {
        localStorage.removeItem('translationHistory');
        loadHistory();
    }
});

// Utility functions
function setLoading(loading) {
    if (loading) {
        translateBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        translateBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    setTimeout(hideError, 5000);
}

function hideError() {
    errorMsg.classList.add('hidden');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}

function truncate(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
