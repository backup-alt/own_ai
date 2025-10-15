// Configuration - UPDATE THESE WITH YOUR ACTUAL KEYS
const CONFIG = {
    VAPI_API_KEY: '465fe5f1-6a4a-4847-86e1-1b56be40dab0', // Your Vapi key
    CATALYST_FUNCTION_URL: 'https://sherwin-60052075848.development.catalystserverless.in/server/sherwin_function/'
};

// UI State Management
let currentMode = 'voice';
let isVoiceActive = false;

// DOM Elements
const toggleOptions = document.querySelectorAll('.toggle-option');
const toggleSlider = document.querySelector('.toggle-slider');
const panels = document.querySelectorAll('.panel');
const voiceBars = document.getElementById('voice-bars');
const voiceToggle = document.getElementById('voice-toggle');
const voiceStatus = document.getElementById('voice-status');
const chatTextarea = document.getElementById('chat-textarea');
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 NeuroSync AI Initialized');
    initializeUI();
    initializeVoiceBars();
    loadTheme();
});

// UI Initialization
function initializeUI() {
    // Toggle functionality
    toggleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const targetPanel = option.getAttribute('data-panel');
            switchMode(targetPanel);
        });
    });

    // Voice controls
    voiceToggle.addEventListener('click', toggleVoiceCall);

    // Chat functionality
    sendButton.addEventListener('click', sendMessage);
    chatTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    chatTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
}

// Mode switching
function switchMode(mode) {
    currentMode = mode;
    
    // Update toggle slider position
    if (mode === 'voice') {
        toggleSlider.style.transform = 'translateX(0)';
    } else {
        toggleSlider.style.transform = 'translateX(100%)';
    }
    
    // Update active class on toggle options
    toggleOptions.forEach(opt => opt.classList.remove('active'));
    document.querySelector(`.toggle-option[data-panel="${mode}"]`).classList.add('active');
    
    // Show/hide panels
    panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${mode}-panel`) {
            panel.classList.add('active');
        }
    });
}

// Voice functionality
function toggleVoiceCall() {
    if (!isVoiceActive) {
        startVoiceCall();
    } else {
        stopVoiceCall();
    }
}

function startVoiceCall() {
    voiceStatus.textContent = '🎤 Voice feature requires Vapi setup';
    voiceToggle.classList.add('active');
    voiceToggle.innerHTML = '<i class="fas fa-phone-slash"></i>';
    isVoiceActive = true;
    
    // Simulate voice connection
    setTimeout(() => {
        voiceStatus.textContent = '🔴 Voice feature coming soon - Setup Vapi API';
    }, 2000);
}

function stopVoiceCall() {
    isVoiceActive = false;
    voiceToggle.classList.remove('active');
    voiceToggle.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceStatus.textContent = '🎤 Ready to connect (Vapi setup required)';
}

// Chat functionality
async function sendMessage() {
    const message = chatTextarea.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    chatTextarea.value = '';
    chatTextarea.style.height = 'auto';
    
    // Disable send button while processing
    sendButton.disabled = true;
    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        console.log('📤 Sending message to Catalyst...');
        const response = await callCatalystFunction(message);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add AI response
        addMessage(response, false);
        console.log('✅ Message sent successfully');
        
    } catch (error) {
        console.error('❌ Error sending message:', error);
        removeTypingIndicator();
        addMessage('⚠️ Sorry, I encountered an error. Please try again.', false);
    } finally {
        // Re-enable send button
        sendButton.disabled = false;
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
}

async function callCatalystFunction(message) {
    try {
        console.log('🔗 Calling Catalyst function:', CONFIG.CATALYST_FUNCTION_URL);
        
        const response = await fetch(CONFIG.CATALYST_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                timestamp: new Date().toISOString()
            })
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Response data:', data);
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data.response || "I received your message!";
        
    } catch (error) {
        console.error('❌ Catalyst function call failed:', error);
        
        // Friendly fallback responses
        const fallbackResponses = [
            "I understand your question! The AI backend is being configured.",
            "Thanks for your message! The chat system is currently in setup mode.",
            "I received your query! DeepSeek integration is in progress.",
            "Hello! The AI assistant is being configured with Catalyst backend.",
            "Great question! The system is currently being set up with AI capabilities."
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
}

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user' : 'ai');
    
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
    messageDiv.innerHTML = `${text}<div class="message-time">${timeString}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Voice bars animation
function initializeVoiceBars() {
    // Create voice bars
    for (let i = 0; i < 40; i++) {
        const bar = document.createElement('div');
        bar.classList.add('voice-bar');
        bar.style.height = `${Math.random() * 60 + 20}px`;
        voiceBars.appendChild(bar);
    }
    
    // Animate voice bars
    setInterval(() => {
        const bars = document.querySelectorAll('.voice-bar');
        bars.forEach(bar => {
            if (isVoiceActive) {
                bar.style.height = `${Math.random() * 60 + 20}px`;
            } else {
                // Gentle idle animation
                bar.style.height = `${20 + Math.sin(Date.now() / 1000 + Math.random()) * 10}px`;
            }
        });
    }, 200);
}

// Theme functionality
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}