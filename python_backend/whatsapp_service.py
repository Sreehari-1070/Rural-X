
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import quote

class WhatsAppService:
    def __init__(self):
        self.driver = None
        self.is_logged_in = False
        self.user_data_dir = os.path.join(os.getcwd(), "whatsapp_user_data")
        
    def start_driver(self):
        if self.driver:
            return

        chrome_options = Options()
        chrome_options.add_argument(f"user-data-dir={self.user_data_dir}")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        # chrome_options.add_argument("--headless") # Headless often fails with WhatsApp Web
        
        try:
            self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
            self.driver.get("https://web.whatsapp.com")
            print("Please scan the QR code if not logged in...")
            
            # Wait for login (check for an element that exists only when logged in)
            # e.g., the side pane or chat list
            try:
                WebDriverWait(self.driver, 60).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "#pane-side, [data-testid='chat-list']"))
                )
                self.is_logged_in = True
                print("WhatsApp Web Logged In Successfully!")
            except Exception as e:
                print("Login Timeout or Error. Please scan QR code manually.")
                
        except Exception as e:
            print(f"Failed to start WhatsApp Driver: {e}")

    def send_message(self, phone: str, message: str) -> bool:
        if not self.driver:
            self.start_driver()
            
        if not self.is_logged_in:
             # Try one more wait if just started
            try:
                WebDriverWait(self.driver, 20).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "#pane-side, [data-testid='chat-list']"))
                )
                self.is_logged_in = True
            except:
                print("Not logged in. Cannot send message.")
                return False

        try:
            # Format phone number: remove + if present, ensure country code
            # Assuming input is just digits like 919876543210
            # WhatsApp Web URL: https://web.whatsapp.com/send?phone=...&text=...
            
            clean_phone = phone.strip('+').replace(' ', '')
            encoded_message = quote(message)
            url = f"https://web.whatsapp.com/send?phone={clean_phone}&text={encoded_message}"
            
            self.driver.get(url)
            
            # Wait for send button and click enter
            # The input box is usually focused, so we can just hit ENTER
            # Or wait for the "send" button
            
            # Wait for message input area to load which implies chat loaded
            send_button = WebDriverWait(self.driver, 30).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "span[data-icon='send']"))
            )
            send_button.click()
            
            # Wait a bit for message to send
            time.sleep(2)
            
            return True
            
        except Exception as e:
            print(f"Error sending message to {phone}: {e}")
            return False

    def close(self):
        if self.driver:
            self.driver.quit()
            self.driver = None
            self.is_logged_in = False
