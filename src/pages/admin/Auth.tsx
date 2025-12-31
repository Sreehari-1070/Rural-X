import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, ArrowLeft, Check, Loader2, Shield } from 'lucide-react';

type AuthStep = 'phone' | 'otp';

export default function AdminAuth() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();

  const [step, setStep] = useState<AuthStep>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) return;

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

      // 2. Client-Side Admin Authorization Check
      // In a real deployed app, this check should ALSO happen on the backend (e.g., getting a JWT with roles)
      // For this demo, we verify the number is in our allowed list after proving ownership via OTP.
      const authorizedAdmins: Record<string, string> = {
        '9988776655': 'Super Admin',
        '7358372007': 'Admin',
        '6382727198': 'Admin User'
      };

      if (!authorizedAdmins[phone]) {
        throw new Error('Unauthorized: This number is not registered as an Admin.');
      }

      const adminData = {
        id: 'admin_' + phone,
        name: authorizedAdmins[phone],
        phone: phone,
        location: 'Tamil Nadu',
        role: 'admin'
      };

      login({
        id: adminData.id,
        name: adminData.name,
        phone: adminData.phone,
        location: 'Tamil Nadu',
        role: 'admin',
      });

      navigate('/admin/dashboard');

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-primary/5" />
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => step === 'otp' ? setStep('phone') : navigate('/')}
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
              {t('adminLogin')}
            </h1>
            <p className="mb-8 text-center text-text-secondary">
              {t('adminPortal')}
            </p>

            {/* Progress Indicator */}
            <div className="mb-8 flex justify-center gap-2">
              <div className={`h-2 w-16 rounded-full ${step === 'phone' ? 'bg-secondary' : 'bg-secondary/30'}`} />
              <div className={`h-2 w-16 rounded-full ${step === 'otp' ? 'bg-secondary' : 'bg-border'}`} />
            </div>

            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Phone Field */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Phone className="h-4 w-4 text-secondary" />
                      Registered Mobile Number
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

                  {/* Note */}
                  <p className="text-center text-xs text-text-tertiary">
                    Admin accounts are pre-registered by system administrators
                  </p>

                  {/* Send OTP Button */}
                  <button
                    onClick={handleSendOTP}
                    disabled={isLoading || phone.length !== 10}
                    className="btn-secondary flex w-full items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      t('sendOTP')
                    )}
                  </button>
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
                    <button className="font-semibold text-secondary hover:underline">
                      {t('resendOTP')}
                    </button>
                  </p>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerify}
                    disabled={isLoading || otp.join('').length !== 6}
                    className="btn-secondary flex w-full items-center justify-center gap-2 disabled:opacity-50"
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
