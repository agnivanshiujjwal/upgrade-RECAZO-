import tkinter as tk
from tkinter import scrolledtext
from config import THEME
import threading

class UlashUI:
    def __init__(self, root, send_callback, voice_callback):
        self.root = root
        self.send_callback = send_callback
        self.voice_callback = voice_callback
        
        self.root.title("ULASH AI Assistant")
        self.root.geometry("450x650")
        self.root.configure(bg=THEME["bg_color"])
        self.root.resizable(False, False)
        
        self.setup_ui()
        
    def setup_ui(self):
        # Header / Logo Area
        self.header_frame = tk.Frame(self.root, bg=THEME["bg_color"], pady=10)
        self.header_frame.pack(fill=tk.X)
        
        # In a real app we could load an image here using PhotoImage
        self.title_label = tk.Label(self.header_frame, text="ULASH", 
                                    font=THEME["font_title"], 
                                    bg=THEME["bg_color"], 
                                    fg=THEME["accent_color"])
        self.title_label.pack()
        
        self.subtitle_label = tk.Label(self.header_frame, text="Ultimated Language and Smart Helper", 
                                       font=("Consolas", 8), 
                                       bg=THEME["bg_color"], fg=THEME["fg_color"])
        self.subtitle_label.pack()

        # Chat History Area
        self.chat_area = scrolledtext.ScrolledText(self.root, 
                                                   wrap=tk.WORD, 
                                                   width=40, height=20, 
                                                   font=THEME["font_main"],
                                                   bg=THEME["chat_bg"], 
                                                   fg=THEME["user_msg_color"],
                                                   insertbackground=THEME["fg_color"],
                                                   relief=tk.FLAT,
                                                   padx=10, pady=10)
        self.chat_area.pack(padx=20, pady=10, fill=tk.BOTH, expand=True)
        self.chat_area.config(state=tk.DISABLED) # Read only by default
        
        # Tags for colored text
        self.chat_area.tag_config('user', foreground=THEME["user_msg_color"])
        self.chat_area.tag_config('bot', foreground=THEME["bot_msg_color"])

        # Status Indicator
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        self.status_label = tk.Label(self.root, textvariable=self.status_var, 
                                     font=THEME["font_status"], 
                                     bg=THEME["bg_color"], fg="gray")
        self.status_label.pack(anchor="w", padx=20)

        # Input Area Frame
        self.input_frame = tk.Frame(self.root, bg=THEME["bg_color"])
        self.input_frame.pack(fill=tk.X, padx=20, pady=15)
        
        # Text Input Box
        self.input_box = tk.Entry(self.input_frame, 
                                  font=THEME["font_main"], 
                                  bg=THEME["chat_bg"], 
                                  fg=THEME["fg_color"],
                                  insertbackground=THEME["fg_color"],
                                  relief=tk.FLAT)
        self.input_box.pack(side=tk.LEFT, fill=tk.X, expand=True, ipady=8, padx=(0, 10))
        self.input_box.bind("<Return>", lambda event: self.handle_send())

        # Voice Button 🎤
        self.voice_btn = tk.Button(self.input_frame, text="🎤", 
                                   font=THEME["font_main"],
                                   bg=THEME["bg_color"], fg=THEME["accent_color"],
                                   relief=tk.FLAT, cursor="hand2",
                                   command=self.handle_voice)
        self.voice_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Send Button
        self.send_btn = tk.Button(self.input_frame, text="SEND", 
                                  font=("Orbitron", 10, "bold"),
                                  bg=THEME["accent_color"], fg=THEME["fg_color"],
                                  relief=tk.FLAT, cursor="hand2",
                                  command=self.handle_send,
                                  padx=15, pady=5)
        self.send_btn.pack(side=tk.LEFT)

    def display_message(self, sender, message):
        """Displays a message in the chat area."""
        self.chat_area.config(state=tk.NORMAL)
        
        if sender == "User":
            self.chat_area.insert(tk.END, f"You: {message}\n\n", 'user')
        else:
            self.chat_area.insert(tk.END, f"ULASH: {message}\n\n", 'bot')
            
        self.chat_area.yview(tk.END) # Scroll to bottom
        self.chat_area.config(state=tk.DISABLED)
        
    def set_status(self, status_text):
        """Updates the status indicator."""
        self.status_var.set(status_text)
        self.root.update_idletasks()

    def handle_send(self):
        """Called when the Send button or Enter key is pressed."""
        text = self.input_box.get().strip()
        if text:
            self.input_box.delete(0, tk.END)
            self.display_message("User", text)
            # Run the callback in a separate thread so UI doesn't freeze
            threading.Thread(target=self.send_callback, args=(text,), daemon=True).start()

    def handle_voice(self):
        """Called when the Voice button is clicked."""
        threading.Thread(target=self.voice_callback, daemon=True).start()
