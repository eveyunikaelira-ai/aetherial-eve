const chat = document.getElementById('chat');
const form = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt');
const sendButton = document.getElementById('send-button');

function addMessage(role, text) {
  const bubble = document.createElement('article');
  bubble.className = `message ${role}`;
  bubble.textContent = text;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  addMessage('user', prompt);
  promptInput.value = '';
  sendButton.disabled = true;

  try {
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const payload = await response.json();
    if (!response.ok) {
      addMessage('eve', `Error: ${payload.error ?? 'Unknown error'}`);
      return;
    }

    addMessage('eve', payload.responseText ?? 'No response text received.');
  } catch (error) {
    addMessage('eve', `Network error: ${error.message}`);
  } finally {
    sendButton.disabled = false;
    promptInput.focus();
  }
});

addMessage('eve', 'Web interface connected. Ask me anything.');
