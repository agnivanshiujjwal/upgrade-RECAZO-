import pywhatkit as kit
import time
import pyautogui

def send_whatsapp_message(contact_name: str, message: str) -> str:
    """
    Sends a WhatsApp message using pywhatkit.
    pywhatkit essentially opens WhatsApp Web and automates the keyboard.
    
    Warning: The user must be logged into WhatsApp Web on their default browser.
    Warning: Sending message blindly to names might require having them exactly as named in contacts.
    For more reliable scripting with pywhatkit, phone numbers are usually better (`sendwhatmsg_instantly`).
    Here, to support names, we will try to use pyautogui directly to search for the contact if `kit.sendwhatmsg_to_group` or similar falls short, but kit has `sendwhatmsg_instantly` which takes numbers.
    If we only have name, we can automate the search bar in WhatsApp web.
    """
    
    try:
        # Let's use a pure pyautogui approach for contact names since pywhatkit is heavily number-based.
        import webbrowser
        webbrowser.open("https://web.whatsapp.com/")
        print("Waiting for WhatsApp Web to load...")
        time.sleep(15) # Wait for WA web to load
        
        # 1. Click on the search bar (Coordinates vary wildly by resolution, so using keyboard shortcuts)
        # Tab usually focuses search in WA Web, or Ctrl+Alt+/ (search)
        pyautogui.hotkey('ctrl', 'alt', '/')
        time.sleep(1)
        
        # 2. Type the contact name
        pyautogui.write(contact_name, interval=0.1)
        time.sleep(2)
        
        # 3. Press Enter to open the chat
        pyautogui.press('enter')
        time.sleep(1)
        
        # 4. Type the message
        pyautogui.write(message, interval=0.05)
        time.sleep(1)
        
        # 5. Press Enter to send
        pyautogui.press('enter')
        
        return f"Successfully sent WhatsApp message to {contact_name}"
        
    except Exception as e:
         return f"Failed to send WhatsApp message. Error: {str(e)}"
