import os

# API Keys
# Replace with your actual Groq API Key, or set it in your environment variables.
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your_groq_api_key_here")

# Assistant Settings
WAKE_WORD = "ulash"

# UI Settings (Black + White + Red Futuristic Theme)
THEME = {
    "bg_color": "#0a0a0a",           # Dark/Black background
    "fg_color": "#ffffff",           # White text
    "accent_color": "#ff0000",       # Red accent (buttons, highlights)
    "accent_hover": "#cc0000",       # Darker red for hover state
    "chat_bg": "#141414",            # Slightly lighter black for chat area
    "bot_msg_color": "#ff0000",      # Red for bot messages inside chat
    "user_msg_color": "#ffffff",     # White for user messages inside chat
    "font_main": ("Orbitron", 12),   # Futuristic font (Orbitron or alternatively Consolas)
    "font_title": ("Orbitron", 20, "bold"),
    "font_status": ("Consolas", 10, "italic")
}

# Supported System Commands (Reference)
SYSTEM_COMMANDS = [
    "open youtube",
    "open google",
    "search on google",
    "play music",
    "tell time",
    "tell date",
    "shutdown pc",
    "restart pc"
]
