// Import
import { marked } from "marked";

// State
let messages = [];
let isWaiting = false;
let sampleResponse = '';

// Load sample response
import.meta.glob?.(['../utils/SampleResponse.txt'], { as: 'raw', eager: true });
fetch(new URL('../utils/SampleResponse.txt', import.meta.url))
    .then(res => res.text())
    .then(text => { sampleResponse = text; })
    .catch(() => { sampleResponse = 'Demo response. Connect to a real API to get actual responses.'; });

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// API config
const API_HOST = window.MYGPT_API_HOST || 'http://localhost:11434';
const MODEL_NAME = 'qwen3.5:9b';

async function callApi(prompt) {
    const endpoints = [
        { url: `${API_HOST}/api/generate`, body: { model: MODEL_NAME, prompt } },
        { url: `${API_HOST}/api/infer`, body: { model: MODEL_NAME, prompt } },
        { url: `${API_HOST}/v1/chat/completions`, body: { model: MODEL_NAME, messages: [{ role: 'user', content: prompt }] } },
    ];

    for (const ep of endpoints) {
        try {
            const res = await fetch(ep.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ep.body)
            });

            if (!res.ok) continue;

            const ct = res.headers.get('content-type') || '';
            // Read as text first to support streamed/NDJSON responses
            const text = await res.text();
            if (!text) continue;

            // Try parsing as a single JSON document
            try {
                const data = JSON.parse(text);
                if (typeof data === 'string') return data;
                if (data.output) return data.output;
                if (data.text) return data.text;
                if (data.result) return data.result;
                if (data.output_text) return data.output_text;
                if (data.data && Array.isArray(data.data) && data.data[0] && data.data[0].text) return data.data[0].text;
                if (data.choices && Array.isArray(data.choices) && data.choices[0]) {
                    if (data.choices[0].text) return data.choices[0].text;
                    if (data.choices[0].message && data.choices[0].message.content) return data.choices[0].message.content;
                }
                return JSON.stringify(data);
            } catch (e) {
                // Not a single JSON object — try to extract multiple JSON objects (NDJSON / concatenated JSON)
                const objs = [];
                let depth = 0;
                let start = -1;
                for (let i = 0; i < text.length; i++) {
                    const ch = text[i];
                    if (ch === '{') {
                        if (depth === 0) start = i;
                        depth++;
                    } else if (ch === '}') {
                        depth--;
                        if (depth === 0 && start !== -1) {
                            const chunk = text.slice(start, i + 1);
                            try {
                                objs.push(JSON.parse(chunk));
                            } catch (err) {
                                // ignore parse errors for this chunk
                            }
                            start = -1;
                        }
                    }
                }

                if (objs.length > 0) {
                    // Assemble textual output from streaming parts (ignore `thinking` chunks)
                    let responseAccum = '';
                    for (const o of objs) {
                        if (o.response) responseAccum += String(o.response);
                    }
                    if (responseAccum.trim().length > 0) return responseAccum;
                    return JSON.stringify(objs);
                }

                // Fallback to raw text
                return text;
            }
        } catch (err) {
            console.warn('callApi endpoint failed', ep.url, err);
            continue;
        }
    }

    throw new Error('No working API endpoint found on ' + API_HOST);
}

// Stream-aware caller: calls endpoint and invokes `onDelta(partialText, done)` as chunks arrive
async function callApiStream(prompt, onDelta) {
    const endpoints = [
        { url: `${API_HOST}/api/generate`, body: { model: MODEL_NAME, prompt } },
        { url: `${API_HOST}/api/infer`, body: { model: MODEL_NAME, prompt } },
        { url: `${API_HOST}/v1/chat/completions`, body: { model: MODEL_NAME, messages: [{ role: 'user', content: prompt }] } },
    ];

    for (const ep of endpoints) {
        try {
            const res = await fetch(ep.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ep.body)
            });

            if (!res.ok) continue;

            // If there's no streaming body, fall back to callApi
            if (!res.body || !res.body.getReader) {
                const text = await res.text();
                // try parse as JSON
                try {
                    const data = JSON.parse(text);
                    const single = data.response || data.output || data.text || (data.choices && data.choices[0] && (data.choices[0].text || (data.choices[0].message && data.choices[0].message.content)));
                    onDelta(String(single || JSON.stringify(data)), true);
                    return String(single || JSON.stringify(data));
                } catch (e) {
                    onDelta(text, true);
                    return text;
                }
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buf = '';
            let responseAccum = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });

                // extract JSON objects from buf
                let depth = 0;
                let start = -1;
                for (let i = 0; i < buf.length; i++) {
                    const ch = buf[i];
                    if (ch === '{') {
                        if (depth === 0) start = i;
                        depth++;
                    } else if (ch === '}') {
                        depth--;
                        if (depth === 0 && start !== -1) {
                            const chunk = buf.slice(start, i + 1);
                            try {
                                const o = JSON.parse(chunk);
                                if (o.response) {
                                    responseAccum += String(o.response);
                                    onDelta(responseAccum, false);
                                }
                                // handle OpenAI-style partials
                                if (o.choices && Array.isArray(o.choices)) {
                                    for (const c of o.choices) {
                                        if (c.delta && (c.delta.content || c.delta.text)) {
                                            const t = c.delta.content || c.delta.text || '';
                                            responseAccum += t;
                                            onDelta(responseAccum, false);
                                        } else if (c.text) {
                                            responseAccum += c.text;
                                            onDelta(responseAccum, false);
                                        } else if (c.message && c.message.content) {
                                            responseAccum += c.message.content;
                                            onDelta(responseAccum, false);
                                        }
                                    }
                                }
                            } catch (err) {
                                // ignore parse error for this chunk
                            }
                            start = -1;
                        }
                    }
                }

                // keep any trailing incomplete data
                if (start !== -1 && depth > 0) buf = buf.slice(start);
                else buf = '';
            }

            const finalText = responseAccum || buf;
            onDelta(String(finalText || ''), true);
            return String(finalText || '');
        } catch (err) {
            console.warn('callApiStream endpoint failed', ep.url, err);
            continue;
        }
    }

    // fallback to the non-streaming caller which will throw if nothing works
    const final = await callApi(prompt);
    onDelta(final, true);
    return final;
}
// UI Control
export function setInputEnabled(enabled) {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    if (sendButton) sendButton.disabled = !enabled;
    if (messageInput) messageInput.disabled = !enabled;
}

// Chat display
export function displayMessages() {
    const messagesArea = document.getElementById('messagesArea');
    
    if (messages.length === 0) {
        messagesArea.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                <h1 class="text-3xl font-bold mb-2">MyGPT</h1>
                <p>Start a new conversation</p>
            </div>
        `;
        return;
    }

    messagesArea.innerHTML = messages.map(msg => {
        // Parse markdown for assistant responses, escape HTML for user messages
        const contentResponse = msg.role === 'assistant' 
            ? marked.parse(msg.content)
            : `<p>${escapeHtml(msg.content)}</p>`;
        
        return `
            <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3">
                <div class="${msg.role === 'user' ? 'max-w-lg px-4 py-2 rounded-lg bg-blue-600 text-white' : 'px-5 py-4 rounded-2xl text-slate-100 prose-sm prose prose-invert'}">
                    ${contentResponse}
                </div>
            </div>
        `;
    }).join('');

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Chat operations
export function sendMessage() {
    if (isWaiting) return;

    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message === '') return;

    isWaiting = true;
    setInputEnabled(false);

    // Add user message
    messages.push({ role: 'user', content: message });
    displayMessages();

    // Clear input
    input.value = '';
    input.focus();

    // Call API (streaming)
    (async () => {
        // insert a placeholder assistant message and keep index
        const assistantIndex = messages.push({ role: 'assistant', content: '' }) - 1;
        displayMessages();

        try {
            await callApiStream(message, (partial, done) => {
                messages[assistantIndex].content = partial;
                displayMessages();
            });
        } catch (err) {
            console.error('API error', err);
            messages[assistantIndex].content = `Error: ${err.message}.`;
            // also push demo response
            messages.push({ role: 'assistant', content: sampleResponse || 'Demo response. Connect to a real API to get actual responses.' });
        } finally {
            isWaiting = false;
            setInputEnabled(true);
            displayMessages();
        }
    })();
}

export function startNewChat() {
    messages = [];
    displayMessages();
    document.getElementById('messageInput').value = '';
    document.getElementById('messageInput').focus();
}

// Event handlers
export function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

export function autoResizeTextarea(event) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 192);
    textarea.style.height = newHeight + 'px';
}

// Initialize on page load
export function initializeChat() {
    document.getElementById('messageInput').focus();
    setInputEnabled(true);
}
