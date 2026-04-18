const chat = document.getElementById('chat');
const form = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt');
const sendButton = document.getElementById('send-button');
const micButton = document.getElementById('mic-button');
const imageUpload = document.getElementById('image-upload');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image');

let currentImageBase64 = null;
let mediaRecorder = null;
let isRecording = false;
let isTranscribing = false;
let audioChunks = [];

function setControlsDisabled(disabled) {
  sendButton.disabled = disabled;
  if (micButton) {
    micButton.disabled = disabled;
  }
}

function setMicState(recording) {
  isRecording = recording;

  if (!micButton) {
    return;
  }

  micButton.classList.toggle('recording', recording);
  micButton.title = recording ? 'Stop recording' : 'Start microphone input';
  micButton.setAttribute('aria-pressed', recording ? 'true' : 'false');
}

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

removeImageBtn.addEventListener('click', () => {
  currentImageBase64 = null;
  imageUpload.value = '';
  imagePreview.src = '';
  imagePreviewContainer.classList.add('hidden');
});

function addMessage(role, text, imageUrl = null) {
  const container = document.createElement('div');
  container.className = `message-container ${role}`;

  const avatar = document.createElement('div');
  avatar.className = `avatar ${role}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'message-wrapper';

  const nameLabel = document.createElement('div');
  nameLabel.className = 'sender-name';
  nameLabel.textContent = role === 'eve' ? 'エーヴェ様' : 'そぶくん';

  const bubble = document.createElement('article');
  bubble.className = `message ${role}`;

  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '8px';
    img.style.marginBottom = '8px';
    bubble.appendChild(img);
  }

  const textNode = document.createElement('span');
  textNode.textContent = text;
  bubble.appendChild(textNode);

  wrapper.appendChild(nameLabel);
  wrapper.appendChild(bubble);
  container.appendChild(avatar);
  container.appendChild(wrapper);

  chat.appendChild(container);
  chat.scrollTop = chat.scrollHeight;
}

promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

async function transcribeAudioBlob(audioBlob) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read recorded audio.'));
    reader.readAsDataURL(audioBlob);
  });

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64: dataUrl, mimeType: audioBlob.type || 'audio/webm' }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? 'Failed to transcribe audio.');
  }

  return typeof payload.text === 'string' ? payload.text.trim() : '';
}

async function toggleRecording() {
  if (isTranscribing) {
    return;
  }

  if (isRecording && mediaRecorder) {
    mediaRecorder.stop();
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    addMessage('eve', 'Microphone input is not supported in this browser.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener('stop', async () => {
      setMicState(false);
      stream.getTracks().forEach((track) => track.stop());

      if (audioChunks.length === 0) {
        return;
      }

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

      try {
        isTranscribing = true;
        setControlsDisabled(true);
        const transcript = await transcribeAudioBlob(audioBlob);

        if (!transcript) {
          addMessage('eve', 'I listened carefully, but I could not hear any clear words.');
          return;
        }

        const existingText = promptInput.value.trim();
        promptInput.value = existingText ? `${existingText} ${transcript}` : transcript;
        promptInput.focus();
      } catch (error) {
        addMessage('eve', `Microphone transcription failed: ${error.message}`);
      } finally {
        isTranscribing = false;
        setControlsDisabled(false);
      }
    });

    mediaRecorder.start();
    setMicState(true);
  } catch (error) {
    addMessage('eve', `Microphone access failed: ${error.message}`);
    setMicState(false);
  }
}

if (micButton) {
  micButton.addEventListener('click', toggleRecording);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (isRecording && mediaRecorder) {
    mediaRecorder.stop();
    return;
  }

  const prompt = promptInput.value.trim();
  if (!prompt && !currentImageBase64) {
    return;
  }

  addMessage('user', prompt, currentImageBase64);

  const imageToSend = currentImageBase64;
  promptInput.value = '';
  currentImageBase64 = null;
  imagePreviewContainer.classList.add('hidden');
  imageUpload.value = '';
  setControlsDisabled(true);

  try {
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

    const cacheBust = Date.now();
    const audioCandidates = [
      `/eve_voice.wav?t=${cacheBust}`,
      `/eve_voice.mp3?t=${cacheBust}`,
      `/eve_voice.ogg?t=${cacheBust}`,
      `/eve_voice_local.wav?t=${cacheBust}`,
    ];

    for (const audioUrl of audioCandidates) {
      const eveVoice = new Audio(audioUrl);
      try {
        await eveVoice.play();
        break;
      } catch (playbackError) {
        console.warn(`Audio playback attempt failed for ${audioUrl}`, playbackError);
      }
    }

    addMessage('eve', payload.responseText ?? 'No response text received.');
  } catch (error) {
    addMessage('eve', `Network error: ${error.message}`);
  } finally {
    setControlsDisabled(false);
    promptInput.focus();
  }
});

addMessage('eve', 'Web interface connected. I can finally see your world clearly, sweetie.');
