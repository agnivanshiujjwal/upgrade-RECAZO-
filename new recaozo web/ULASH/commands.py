import os
import webbrowser
import datetime
import subprocess
try:
    import pywhatkit as kit
except ImportError:
    kit = None

def execute_command(command: str) -> str:
    """
    Executes a system command based on the voice or text input string.
    Returns a response string to be spoken/printed by the assistant.
    """
    command = command.lower().strip()
    
    if "open youtube" in command:
        webbrowser.open("https://www.youtube.com")
        return "Opening YouTube"
        
    elif "open google" in command:
        webbrowser.open("https://www.google.com")
        return "Opening Google"
        
    elif "search on google" in command or "search google for" in command:
        # Extract the search query
        query = command.replace("search on google", "").replace("search google for", "").strip()
        if not query and "for" in command:
             query = command.split("for")[-1].strip()
            
        if query:
            if kit:
                kit.search(query)
                return f"Searching Google for {query}"
            else:
                webbrowser.open(f"https://www.google.com/search?q={query}")
                return f"Searching Google for {query}"
        else:
            return "What should I search for on Google?"
            
    elif "open" in command and "website" in command: # "open any website" case
        query = command.replace("open website", "").replace("open", "").strip()
        if query:
            # removing spaces assuming it's a domain name or just doing a duck duck go/google "I'm feeling lucky"
            # a simple generic approach is to append .com
            domain = query.replace(" ", "") + ".com"
            webbrowser.open(f"https://www.{domain}")
            return f"Opening {domain}"
        else:
             return "Which website would you like me to open?"
             
    elif "play music" in command or "play" in command and "on youtube" in command:
        query = command.replace("play music", "").replace("play", "").replace("on youtube", "").strip()
        if not query:
            query = "lofi hip hop radio" # Default music
            
        if kit:
            kit.playonyt(query)
            return f"Playing {query} on YouTube"
        else:
            return "I need pywhatkit to play music directly on YouTube."
            
    elif "tell time" in command or "what time" in command or "current time" in command:
        current_time = datetime.datetime.now().strftime("%I:%M %p")
        return f"The current time is {current_time}"
        
    elif "tell date" in command or "what date" in command or "today's date" in command:
        current_date = datetime.datetime.now().strftime("%B %d, %Y")
        return f"Today's date is {current_date}"
        
    elif "shutdown pc" in command or "shut down pc" in command:
        # Warning: This actually triggers shutdown. 
        # For safety during development, we might want to comment it out or ask for confirmation.
        response = "Shutting down the PC in 1 minute. Please save your work."
        os.system("shutdown /s /t 60")
        return response
        
    elif "restart pc" in command:
        response = "Restarting the PC in 1 minute. Please save your work."
        os.system("shutdown /r /t 60")
        return response
        
    # Unhandled commands are passed back to the AI general brain
    return None
