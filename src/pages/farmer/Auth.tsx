import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { districts } from '@/lib/translations';
import {
  Phone, User, MapPin, ArrowLeft, ArrowRight,
  Check, Loader2, ChevronDown
} from 'lucide-react';

type AuthStep = 'info' | 'otp';
type AuthMode = 'login' | 'signup';

export default function FarmerAuth() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signup');
  const [step, setStep] = useState<AuthStep>('info');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) return;
    if (mode === 'signup' && (!name || !location)) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8001/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send OTP');
      }

      setStep('otp');
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setIsLoading(true);

    try {
      // 1. Verify OTP with Backend
      const verifyResponse = await fetch('http://localhost:8001/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpValue }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.detail || 'Invalid OTP');
      }

      // 2. Proceed with Login/Signup Logic (Client-Side DB for Demo Persistence)
      const DB_KEY = 'ruralx_farmers_db';
      const farmersDB = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
      let userData;

      if (mode === 'signup') {
        const exists = farmersDB.find((f: any) => f.phone === phone);
        if (exists) {
          throw new Error('User already exists. Please Login.');
        }

        // Create new user object
        userData = {
          id: Date.now().toString(),
          name,
          phone,
          location,
          role: 'farmer',
          community: `${location} Farmers`,
          landArea: 5.5,
          soilType: 'Loamy',
          memberSince: new Date().toISOString().split('T')[0]
        };

        // Also sync with backend DB (optional but good for consistency)
        try {
          await fetch('http://localhost:8001/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
        } catch (e) {
          console.warn("Backend sync failed, using local storage", e);
        }

        farmersDB.push(userData);
        localStorage.setItem(DB_KEY, JSON.stringify(farmersDB));

      } else {
        // Login Mode
        const user = farmersDB.find((f: any) => f.phone === phone);

        if (!user) {
          // allow the demo phone number to work even if not in local storage initially
          if (phone === '9876543210') {
            userData = {
              id: 'demo_1',
              name: 'Demo Farmer',
              phone: '9876543210',
              location: 'Thanjavur',
              role: 'farmer',
              community: 'Thanjavur Farmers',
              landArea: 5.0,
              soilType: 'Clay',
              memberSince: '2024-01-01'
            };
            // Auto-save demo user so it persists next time
            farmersDB.push(userData);
            localStorage.setItem(DB_KEY, JSON.stringify(farmersDB));
          } else {
            throw new Error('User not found. Please Sign Up first.');
          }
        } else {
          userData = user;
        }
      }

      // Success - Login with data from backend
      login(userData);
      navigate('/farmer/dashboard');

    } catch (error: any) {
      console.error(error);
      alert(error.message); // Simple error feedback for now
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => step === 'otp' ? setStep('info') : navigate('/')}
            className="mb-6 flex items-center gap-2 text-text-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>

          {/* Card */}
          <div className="glass-strong rounded-3xl p-8 shadow-xl">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img src="/images/logo.jpg" alt="RuralX Logo" className="h-20 w-auto object-contain mb-2" />
            </div>

            {/* Title */}
            <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
              {mode === 'login' ? t('login') : t('signup')}
            </h1>
            <p className="mb-8 text-center text-text-secondary">
              {t('farmerPortal')}
            </p>

            {/* Progress Indicator */}
            <div className="mb-8 flex justify-center gap-2">
              <div className={`h-2 w-16 rounded-full ${step === 'info' ? 'bg-primary' : 'bg-primary/30'}`} />
              <div className={`h-2 w-16 rounded-full ${step === 'otp' ? 'bg-primary' : 'bg-border'}`} />
            </div>

            <AnimatePresence mode="wait">
              {step === 'info' ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Name Field (signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <User className="h-4 w-4 text-primary" />
                        {t('farmerName')}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('enterName')}
                        className="input-field"
                      />
                    </div>
                  )}

                  {/* Phone Field */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      {t('phoneNumber')}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex h-[50px] w-16 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
                        +91
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        className="input-field flex-1"
                      />
                    </div>
                  </div>

                  {/* Location Field (signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {t('location')}
                      </label>
                      <div className="relative">
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="input-field appearance-none pr-10"
                        >
                          <option value="">{t('selectDistrict')}</option>
                          {districts.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
                      </div>
                    </div>
                  )}

                  {/* Send OTP Button */}
                  <button
                    onClick={handleSendOTP}
                    disabled={isLoading || !phone || phone.length !== 10 || (mode === 'signup' && (!name || !location))}
                    className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {t('sendOTP')}
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  {/* Toggle Mode */}
                  <p className="text-center text-sm text-text-secondary">
                    {mode === 'signup' ? t('existingUser') : t('newUser')}{' '}
                    <button
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="font-semibold text-primary hover:underline"
                    >
                      {mode === 'signup' ? t('loginHere') : t('signupHere')}
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* OTP Info */}
                  <div className="text-center">
                    <p className="text-text-secondary">{t('otpSentTo')}</p>
                    <p className="font-semibold text-foreground">+91 {phone}</p>
                  </div>

                  {/* OTP Input */}
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        className="otp-input"
                        maxLength={1}
                      />
                    ))}
                  </div>

                  {/* Resend */}
                  <p className="text-center text-sm text-text-secondary">
                    Didn't receive OTP?{' '}
                    <button className="font-semibold text-primary hover:underline">
                      {t('resendOTP')}
                    </button>
                  </p>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerify}
                    disabled={isLoading || otp.join('').length !== 6}
                    className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        {t('verifyAndContinue')}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
