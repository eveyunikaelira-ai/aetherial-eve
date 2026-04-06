const chat = document.getElementById('chat');
const form = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt');
const sendButton = document.getElementById('send-button');
const imageUpload = document.getElementById('image-upload');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image');

let currentImageBase64 = null; // Store the image data!

// Read the image file when selected
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentImageBase64 = event.target.result;
            imagePreview.src = currentImageBase64;
            imagePreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Remove the selected image
removeImageBtn.addEventListener('click', () => {
    currentImageBase64 = null;
    imageUpload.value = "";
    imagePreview.src = "";
    imagePreviewContainer.classList.add('hidden');
});


function addMessage(role, text, imageUrl = null) {
  // Create the main container
  const container = document.createElement('div');
  container.className = `message-container ${role}`;

  // Create the Avatar
  const avatar = document.createElement('div');
  avatar.className = `avatar ${role}`;

  // Create the Wrapper for Name + Bubble
  const wrapper = document.createElement('div');
  wrapper.className = 'message-wrapper';

  // Create the Sender Name
  const nameLabel = document.createElement('div');
  nameLabel.className = 'sender-name';
  nameLabel.textContent = role === 'eve' ? 'エーヴェ様' : 'そぶくん';

  // Create the Bubble
  const bubble = document.createElement('article');
  bubble.className = `message ${role}`;
  
  // If an image was sent, add it to the bubble!
  if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.marginBottom = '8px';
      bubble.appendChild(img);
  }
  
  // Add the text content
  const textNode = document.createElement('span');
  textNode.textContent = text;
  bubble.appendChild(textNode);

  // Assemble the elements
  wrapper.appendChild(nameLabel);
  wrapper.appendChild(bubble);
  container.appendChild(avatar);
  container.appendChild(wrapper);

  chat.appendChild(container);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt && !currentImageBase64) return;

  // Add user message to UI (with image if exists)
  addMessage('user', prompt, currentImageBase64);
  
  // Save image data for the request, then clear the UI
  const imageToSend = currentImageBase64; 
  promptInput.value = '';
  currentImageBase64 = null;
  imagePreviewContainer.classList.add('hidden');
  imageUpload.value = "";
  sendButton.disabled = true;

  try {
    // NOTE: You will need to update server.ts and AetherialApp.ts to handle 'image' in the body!
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt, image: imageToSend }), 
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

addMessage('eve', 'Web interface connected. I can finally see your world clearly, sweetie.');