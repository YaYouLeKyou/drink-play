class AIChat {
    constructor() {
        this.toggleButton = document.getElementById('ai-chat-toggle');
        this.panel = document.getElementById('ai-chat-panel');
        this.closeButton = document.getElementById('ai-chat-close');
        this.input = document.getElementById('ai-chat-input');
        this.sendButton = document.getElementById('ai-chat-send');
        this.messagesContainer = document.getElementById('ai-chat-messages');
        this.badge = document.getElementById('ai-chat-badge');
        this.messages = [];

        this.init();
    }

    init() {
        this.toggleButton.addEventListener('click', () => this.togglePanel());
        this.closeButton.addEventListener('click', () => this.closePanel());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.badge.style.display = 'inline-block';
    }

    togglePanel() {
        this.panel.classList.toggle('open');
        this.badge.style.display = 'none';
    }

    closePanel() {
        this.panel.classList.remove('open');
    }

    addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + (isUser ? 'user-message' : 'ai-message');
        messageDiv.textContent = content;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    setSendingState(sending) {
        this.input.disabled = sending;
        this.sendButton.disabled = sending;
        this.sendButton.textContent = sending ? 'Envoi...' : 'Envoyer';
    }

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, true);
        this.messages.push({ role: 'user', content: text });
        this.input.value = '';
        this.setSendingState(true);

        const typingDiv = this.showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: this.messages }),
            });

            this.removeTypingIndicator(typingDiv);

            if (!response.ok) {
                let errorData = { error: 'AI error' };
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { error: `HTTP ${response.status}` };
                }
                throw new Error(errorData.error || 'Unknown error');
            }

            const data = await response.json();
            this.addMessage(data.message, false);
            this.messages.push({ role: 'assistant', content: data.message });
        } catch (error) {
            this.removeTypingIndicator(typingDiv);
            this.addMessage('Désolé, je n\'ai pas pu répondre. Réessaie plus tard !', false);
            console.error('AI chat error:', error);
        } finally {
            this.setSendingState(false);
            this.input.focus();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIChat();
});
