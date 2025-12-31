
import os
import google.generativeai as genai
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("WARNING: GEMINI_API_KEY not found in environment variables.")
        else:
            genai.configure(api_key=self.api_key)
            # Use the faster, cheaper Flash model for chat
            self.model = genai.GenerativeModel('gemini-flash-latest')
            self.vision_model = genai.GenerativeModel('gemini-flash-latest') # Flash supports multi-modal

    def generate_chat_response(self, message: str, history: List[dict] = []) -> str:
        """
        Generates a response from Gemini based on user message and simplified history.
        History format expected: [{'role': 'user', 'parts': ['msg']}, {'role': 'model', 'parts': ['msg']}]
        """
        if not self.api_key:
            return "I am currently offline. Please check my configuration."

        try:
            # Transform history to Gemini format if needed, but the list of dicts 
            # with 'role' and 'parts' is exactly what start_chat expects.
            chat = self.model.start_chat(history=history)
            
            # Context prompt to ensure it behaves like AgriPal
            system_instruction = "You are AgriPal, a helpful and friendly AI farming assistant. Keep answers concise, practical, and easy for farmers to understand. Use emojis occasionally."
            
            # We can't easily inject system instruction in `start_chat` history without a 'system' role which isn't fully standard in the python client yet for all models in this way,
            # so we prepend it to the message or rely on the model's general capabilities. 
            # Better approach: Prepend to the first message or send as a user message that establishes context if history is empty.
            
            full_prompt = message
            if not history:
                 full_prompt = f"{system_instruction}\n\nUser Question: {message}"

            response = chat.send_message(full_prompt)
            return response.text
        except Exception as e:
            print(f"Gemini Chat Error: {e}")
            return "Sorry, I'm having trouble thinking right now. Please try again later."

    def analyze_image(self, image_data, prompt: str = "Analyze this image related to agriculture") -> str:
        """
        Analyzes an image provided as PIL Image or bytes.
        """
        if not self.api_key:
            return "I am unable to see images right now."

        try:
            # Gemini Python SDK supports PIL images directly
            response = self.vision_model.generate_content([prompt, image_data])
            return response.text
        except Exception as e:
            print(f"Gemini Vision Error: {e}")
            return "I couldn't analyze that image. Please ensure it's a clear photo."
