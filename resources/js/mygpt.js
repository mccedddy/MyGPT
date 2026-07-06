let messages = [];
let isWaiting = false;

function setInputEnabled(enabled) {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    if (sendButton) sendButton.disabled = !enabled;
    if (messageInput) messageInput.disabled = !enabled;
}

function startNewChat() {
    messages = [];
    document.getElementById('messagesArea').innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <h1 class="text-3xl font-bold mb-2">MyGPT</h1>
            <p>Start a new conversation</p>
        </div>
    `;
    document.getElementById('messageInput').value = '';
    document.getElementById('messageInput').focus();
}

function sendMessage() {
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

    // Simulate AI response
    setTimeout(() => {
        messages.push({
            role: 'assistant',
            content: 'This is a demo response. Connect to a real API to get actual AI responses. This is a demo response. Connect to a real API to get actual AI responses. This is a demo response. Connect to a real API to get actual AI responses. \n\nThis is a demo response. Connect to a real API to get actual AI responses.\nThis is a demo response. Connect to a real API to get actual AI responses. This is a demo response. Connect to a real API to get actual AI responses.'
        });
        isWaiting = false;
        setInputEnabled(true);
        displayMessages();
    }, 500);
}

function displayMessages() {
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

    messagesArea.innerHTML = messages.map(msg => `
        <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3">
            <div class="${msg.role === 'user' ? 'max-w-lg px-4 py-2 rounded-lg bg-blue-600 text-white' : 'w-full max-w-full px-5 py-4 rounded-2xl'}">
                ${escapeHtml(msg.content)}
            </div>
        </div>
    `).join('');

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea(event) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 192);
    textarea.style.height = newHeight + 'px';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Focus input on load
window.addEventListener('load', () => {
    document.getElementById('messageInput').focus();
    setInputEnabled(true);
});

// Make functions globally available
window.startNewChat = startNewChat;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.autoResizeTextarea = autoResizeTextarea;
