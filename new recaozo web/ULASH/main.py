import tkinter as tk
import threading
import time

from ui import UlashUI
from speech import speak, listen
from ai_brain import generate_response
from commands import execute_command
from config import WAKE_WORD
import whatsapp

def process_input(text, ui):
    """
    Processes the user's input (voice or text), checks for system commands, 
    WhatsApp commands, or passes it to the AI brain.
    """
    if not text:
        return

    text = text.lower().strip()
    
    # Check if we need to remove wake word if spoken
    if text.startswith(WAKE_WORD):
        text = text.replace(WAKE_WORD, "", 1).strip()

    ui.set_status("ULASH is thinking...")
    
    # 1. Check for system commands
    action_response = execute_command(text)
    
    if action_response:
        ui.display_message("ULASH", action_response)
        speak(action_response)
        ui.set_status("Ready")
        return

    # 2. Check for WhatsApp commands
    if "whatsapp message" in text or "send whatsapp" in text:
        # Simple extraction logic: "send whatsapp message to [Name]"
        # Note: A real implementation might use AI to parse the intent better.
        try:
            parts = text.split("to")
            if len(parts) > 1:
                contact_name = parts[1].strip()
                
                ui.display_message("ULASH", f"What message should I send to {contact_name}?")
                speak(f"What message should I send to {contact_name}?")
                
                ui.set_status("Listening for message...")
                
                # We need to get the next input for the message.
                # For simplicity in this loop, we'll try listening. 
                # If they are typing, we'd need a multi-turn state machine. 
                # Here we default to voice if WhatsApp command was triggered.
                msg_content = listen()
                
                if msg_content:
                     ui.display_message("User", msg_content)
                     ui.set_status("Sending WhatsApp message...")
                     result = whatsapp.send_whatsapp_message(contact_name, msg_content)
                     ui.display_message("ULASH", result)
                     speak(result)
                else:
                     ui.display_message("ULASH", "I didn't catch the message. Cancelling.")
                     speak("I didn't catch the message. Cancelling.")
            else:
                 ui.display_message("ULASH", "Who should I send it to?")
                 speak("Who should I send it to?")
                 
            ui.set_status("Ready")
            return
            
        except Exception as e:
            ui.display_message("ULASH", f"Error processing WhatsApp command: {e}")
            ui.set_status("Ready")
            return

    # 3. Fallback: Chat with AI Brain
    ai_reply = generate_response(text)
    ui.display_message("ULASH", ai_reply)
    speak(ai_reply)
    ui.set_status("Ready")


def on_text_send(text):
    """Callback for UI text input."""
    # We already have `app` in scope via closure or global usually, 
    # but we can pass it down. For simplicity, we assume `app` is a global in main.
    process_input(text, app)

def on_voice_click():
    """Callback for UI voice button."""
    app.set_status("Listening...")
    spoken_text = listen()
    
    if spoken_text:
        app.display_message("User", spoken_text)
        process_input(spoken_text, app)
    else:
        app.set_status("Ready")

def start_greeting():
    """Plays greeting animation and speech."""
    app.set_status("Initializing Core Systems...")
    time.sleep(1) # simulate loading
    greeting = "Hello! I am ULASH. All systems are online. How can I assist you today?"
    app.display_message("ULASH", greeting)
    speak(greeting)
    app.set_status("Ready")

if __name__ == "__main__":
    root = tk.Tk()
    app = UlashUI(root, send_callback=on_text_send, voice_callback=on_voice_click)
    
    # Start greeting in a separate thread so UI shows up immediately
    threading.Thread(target=start_greeting, daemon=True).start()
    
    # Start the Tkinter main event loop
    root.mainloop()
