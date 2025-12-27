"use client";

import { useFormStatus, useFormState } from "react-dom";
import { updateGuest } from "../_lib/actions";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function UpdateProfileForm({ guest, children }) {
  const [state, formAction] = useFormState(updateGuest, { error: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState(180);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isModalOpen && timer > 0 && !isSuccess) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isModalOpen, timer, isSuccess]);

  if (!guest) return null;

  const { fullName, email, nationality, nationalID, countryFlag } = guest;
  const isVerifiedInDb = nationalID && nationalID.length >= 6;
  const showVerifiedBadge = isVerifiedInDb || isSuccess;

  const isCode = countryFlag?.length === 2;
  const flagUrl = isCode 
    ? `https://flagcdn.com/w40/${countryFlag.toLowerCase()}.png`
    : countryFlag;

  const handleSendOtp = () => {
    setIsModalOpen(true);
    setTimer(180);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const verifyOtp = () => {
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => setIsModalOpen(false), 1500);
    }, 2000);
  };

  return (
    <>
      <form
        action={formAction}
        className="bg-primary-900/30 backdrop-blur-xl border border-accent-500/10 py-10 px-12 text-lg flex flex-col gap-10 rounded-3xl shadow-2xl relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-3">
            <label className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">Full Legal Name</label>
            <input
              defaultValue={fullName}
              name="fullName"
              placeholder="Your official name"
              className="px-6 py-4 bg-primary-950/50 border border-accent-500/10 text-primary-100 w-full shadow-inner rounded-2xl focus:ring-2 focus:ring-accent-500 outline-none transition-all placeholder:text-primary-700"
            />
          </div>

          <div className="space-y-3">
            <label className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">Email Address</label>
            <input
              disabled
              defaultValue={email}
              name="email"
              className="px-6 py-4 bg-primary-950/50 border border-accent-500/5 text-primary-400 w-full shadow-inner rounded-2xl disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="nationality" className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">Nationality</label>
              {flagUrl && (
                <div className="relative h-4 w-6">
                   <img
                     src={flagUrl}
                     alt="Country flag"
                     className="h-full w-full object-cover rounded-[2px] shadow-sm border border-white/10"
                   />
                </div>
              )}
            </div>
            {children}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <label htmlFor="nationalID" className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">National ID / Passport</label>
               <div className="flex gap-2">
                 {showVerifiedBadge ? (
                   <span className="flex items-center gap-1 text-[9px] font-bold text-green-500 uppercase tracking-tighter bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 animate-fade-in">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      Identity Verified
                   </span>
                 ) : (
                   <button 
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[9px] font-bold text-accent-500 uppercase tracking-tighter bg-accent-500/10 px-2 py-0.5 rounded-full border border-accent-500/20 hover:bg-accent-500 hover:text-primary-950 transition-all active:scale-95"
                   >
                      Send OTP
                   </button>
                 )}
               </div>
            </div>
            <input
              defaultValue={nationalID}
              name="nationalID"
              className="px-6 py-4 bg-primary-950/50 border border-accent-500/10 text-primary-100 w-full shadow-inner rounded-2xl focus:ring-2 focus:ring-accent-500 outline-none transition-all placeholder:text-primary-700 font-mono tracking-wider"
              placeholder="e.g. 12345678"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-accent-500/5 flex flex-col gap-6">
          {state?.error && (
            <div className="text-red-400 bg-red-950/20 border border-red-900/40 p-5 rounded-2xl text-sm animate-shake backdrop-blur-md">
               <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">Configuration Error</span>
               {state.error}
            </div>
          )}

          {state?.success && (
            <div className="text-accent-400 bg-accent-950/20 border border-accent-900/40 p-5 rounded-2xl text-sm animate-fade-in backdrop-blur-md">
              <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">Success</span>
              {state.message}
            </div>
          )}

          <div className="flex justify-end items-center gap-6">
            <Button />
          </div>
        </div>
      </form>

      {/* OTP MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-primary-900 border border-accent-500/10 rounded-3xl p-10 shadow-3xl overflow-hidden"
            >
              {/* Modal Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent-500/10 blur-[100px] pointer-events-none" />

              <div className="relative z-10 text-center">
                <div className="h-16 w-16 bg-accent-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent-500/20">
                  <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-serif text-white mb-2">Secure Verification</h3>
                <p className="text-primary-400 text-sm mb-8">We&apos;ve sent a 6-digit concierge code to <br/><span className="text-primary-100 font-bold">{email}</span></p>

                {!isSuccess ? (
                  <>
                    <div className="flex justify-center gap-3 mb-8">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          className="w-12 h-16 bg-primary-950/50 border border-accent-500/10 rounded-xl text-center text-2xl font-bold text-accent-500 focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                        />
                      ))}
                    </div>

                    <div className="mb-8">
                       <p className="text-xs text-primary-500 uppercase tracking-widest font-black mb-2">Code Expires In</p>
                       <p className={`text-xl font-mono ${timer < 30 ? 'text-red-400 animate-pulse' : 'text-primary-200'}`}>
                          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                       </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        onClick={verifyOtp}
                        disabled={isVerifying || otp.some(d => !d)}
                        className="w-full bg-accent-500 py-4 rounded-2xl text-primary-950 font-bold text-sm uppercase tracking-widest hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-accent-500/10"
                      >
                        {isVerifying ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : "Verify Identity"}
                      </button>
                      
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-xs text-primary-500 hover:text-primary-300 transition-colors uppercase tracking-widest font-black"
                      >
                        Cancel Transfer
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center py-6"
                  >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mb-4">
                       <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                       </svg>
                    </div>
                    <p className="text-xl text-green-500 font-serif italic">Identity Confirmed</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-accent-500 px-10 py-4 rounded-full text-primary-950 font-bold text-xs uppercase tracking-widest hover:bg-accent-400 transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-accent-500/10 active:scale-95"
      disabled={pending}
    >
      {pending ? "Saving..." : "Update Guest Profile"}
    </button>
  );
}

export default UpdateProfileForm;
