
import os
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NotificationService:
    def __init__(self):
        # We rely on 'TWILIO_ACCOUNT_SID' and 'TWILIO_AUTH_TOKEN' being present in .env
        # Check standard env vars first
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.from_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        # Note: If using API Keys, 'account_sid' here should technically be the Account SID, 
        # and we would pass api_key and api_secret.
        # However, for simplicity given the provided credentials, we will attempt to initialize
        # the client with what we have. If the provided 'SID' is actually an API Key SID,
        # and 'Token' is the Secret, this format (username, password) works for simple auth
        # IF the library can infer the account or if we are using it for basic SMS.
        # But 'Messages.create' requires an Account Context.
        # If this fails, the user MUST provide the real Account SID (starts with 'AC').
        
        self.client = None
        if self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
            except Exception as e:
                print(f"Twilio Client Init Error: {e}")

    def send_sms(self, to_number: str, body: str) -> bool:
        if not self.client:
            print("Twilio client not initialized. Check .env")
            return False

        try:
            # Ensure number has + prefix
            if not to_number.startswith('+'):
                to_number = '+' + to_number
                
            message = self.client.messages.create(
                body=body,
                from_=self.from_number,
                to=to_number
            )
            print(f"SMS sent: {message.sid}")
            return True
        except Exception as e:
            print(f"Failed to send SMS to {to_number}: {e}")
            return False

