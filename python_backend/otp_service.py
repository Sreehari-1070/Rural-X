
import random
import hashlib
import time
from typing import Dict, Tuple

class OTPService:
    def __init__(self):
        # In-memory storage: phone -> (hashed_otp, expiry_timestamp, attempts)
        self.otp_storage: Dict[str, Tuple[str, float, int]] = {}
        self.SALT = "ruralx_hackathon_secret_salt"  # In prod, use env var

    def _hash_otp(self, otp: str) -> str:
        return hashlib.sha256((otp + self.SALT).encode()).hexdigest()

    def generate_otp(self, phone: str) -> str:
        otp = str(random.randint(100000, 999999))
        expiry = time.time() + 300  # 5 minutes
        hashed_otp = self._hash_otp(otp)
        
        # Store OTP with 0 attempts
        self.otp_storage[phone] = (hashed_otp, expiry, 0)
        return otp

    def verify_otp(self, phone: str, otp_input: str) -> Tuple[bool, str]:
        if phone not in self.otp_storage:
            return False, "OTP not found or expired"

        hashed_stored_otp, expiry, attempts = self.otp_storage[phone]

        if time.time() > expiry:
            del self.otp_storage[phone]
            return False, "OTP expired"

        if attempts >= 3:
            del self.otp_storage[phone]
            return False, "Too many failed attempts"

        if self._hash_otp(otp_input) == hashed_stored_otp:
            del self.otp_storage[phone]  # Verify only once
            return True, "Success"
        
        # Increment attempts
        self.otp_storage[phone] = (hashed_stored_otp, expiry, attempts + 1)
        return False, "Invalid OTP"
