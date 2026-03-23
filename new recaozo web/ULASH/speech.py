import speech_recognition as sr
import pyttsx3

# Initialize Text-to-Speech Engine
try:
    engine = pyttsx3.init()
    # Optional: configure voice (0 = male, 1 = female on windows typically)
    voices = engine.getProperty('voices')
    if len(voices) > 1:
        engine.setProperty('voice', voices[1].id) # Female voice
    else:
        engine.setProperty('voice', voices[0].id)
        
    engine.setProperty('rate', 170) # Set speaking rate
except Exception as e:
    print(f"Error initializing pyttsx3: {e}")
    engine = None

def speak(text: str):
    """Convert text to speech."""
    if engine:
        # Stop any ongoing speech.
        engine.stop()
        print(f"ULASH: {text}")
        engine.say(text)
        engine.runAndWait()
    else:
        print(f"ULASH (No TTS): {text}")

def listen() -> str:
    """
    Listen to the microphone and convert speech to text using Google Speech Recognition.
    Returns the recognized text as a string in lowercase.
    """
    recognizer = sr.Recognizer()
    
    with sr.Microphone() as source:
        print("Listening...")
        # Adjust for ambient noise briefly
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        
        try:
            # listen for audio, timeout after 5 seconds of silence, limit recording to 10 seconds total
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            print("Recognizing...")
            text = recognizer.recognize_google(audio)
            return text.lower()
        except sr.WaitTimeoutError:
            print("Listening timed out. No speech detected.")
            return ""
        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand audio.")
            return ""
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
            return ""
        except Exception as e:
            print(f"Error accessing microphone: {e}")
            return ""
