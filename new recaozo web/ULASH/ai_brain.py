import os
from groq import Groq
from config import GROQ_API_KEY

try:
    client = Groq(api_key=GROQ_API_KEY)
except Exception as e:
    print(f"Failed to initialize Groq client: {e}")
    client = None

SYSTEM_PROMPT = "You are ULASH (Ultimated Language and Smart Helper), a highly intelligent AI desktop assistant."

chat_history = [{"role": "system", "content": SYSTEM_PROMPT.strip()}]

def generate_response(prompt: str) -> str:
    if not client:
        return "I am disconnected."

    chat_history.append({"role": "user", "content": prompt})

    if len(chat_history) > 11:
        recent_history = [chat_history[0]] + chat_history[-10:]
    else:
        recent_history = chat_history

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=recent_history,
            temperature=0.7,
            max_tokens=256,
        )
        reply = completion.choices[0].message.content.strip()
        chat_history.append({"role": "assistant", "content": reply})
        return reply
    except Exception as e:
        print(f"Error: {e}")
        return "Network error."
