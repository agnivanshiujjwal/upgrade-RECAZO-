# ULASH (Ultimated Language and Smart Helper)

A futuristic Black, White, and Red Desktop AI assistant.

## Setup Instructions

1. **Install Dependencies**
   Make sure you have Python installed. Then open a terminal in this folder and run:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: If `pyaudio` fails to install on Windows, you may need to install it via wheel or install Visual C++ Build Tools.*

2. **API Key Setup**
   Open `config.py` in a text editor and replace `"your_groq_api_key_here"` with your actual Groq API Key.
   Or set the environment variable `GROQ_API_KEY`.

3. **Running the Application**
   Run the application from the terminal:
   ```bash
   python main.py
   ```

## Features Supported
- **Voice & Typing Mode**: Use the 🎤 button to talk, or type in the box.
- **Commands**: "open youtube", "search on google [query]", "tell time", "tell date", "shutdown pc", "restart pc".
- **WhatsApp**: "send whatsapp message to [Contact Name]" (Uses pyautogui, ensure WhatsApp Web is logged in).
- **AI Chat**: Any other prompt is handled by the Groq Llama 3 API for fast intelligent responses.

## Converting to .exe installer (Windows)

To bundle this application into a standalone Windows executable (`.exe`):

1. Install PyInstaller (it's already in requirements, but verify):
   ```bash
   pip install pyinstaller
   ```

2. Run the packaging command from the `ULASH` directory:
   ```bash
   pyinstaller --noconfirm --onedir --windowed --name "ULASH" --add-data "config.py;." "main.py"
   ```
   *Note: While `--onefile` is possible (`pyinstaller --noconfirm --onefile --windowed main.py`), `--onedir` is often faster to launch and easier to debug for larger apps.*

3. Your `.exe` will be generated inside the `dist/ULASH` folder. You can create a shortcut to `ULASH.exe` on your desktop.
