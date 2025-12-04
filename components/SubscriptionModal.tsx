import React, { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState<'card' | 'bank'>('card');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert("Test Payment Processed! In a real app, this would connect to Stripe.");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[var(--bg-secondary)] border border-[var(--bg-hover)] rounded-2xl w-full max-w-2xl relative shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        <div className="flex flex-col md:flex-row h-full min-h-[500px]">
          {/* Left Side: Pitch */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-[var(--accent)] to-emerald-900 p-8 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Go Premium</h2>
              <p className="text-white/80 mb-6">Unlock the full power of SoundWave.</p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check-circle"></i> Ad-free music</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check-circle"></i> Offline playback</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check-circle"></i> High quality audio</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check-circle"></i> Support artists</li>
              </ul>
            </div>
            <div className="mt-8">
              <div className="text-4xl font-bold">$9.99<span className="text-sm font-normal opacity-70">/mo</span></div>
            </div>
          </div>

          {/* Right Side: Payment */}
          <div className="w-full md:w-3/5 p-8 bg-[var(--bg-secondary)]">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Payment Method</h3>
            
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setMethod('card')}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${method === 'card' ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--bg-hover)] text-[var(--text-secondary)]'}`}
              >
                <i className="fa-brands fa-stripe mr-2"></i> Card
              </button>
              <button 
                onClick={() => setMethod('bank')}
                 className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${method === 'bank' ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--bg-hover)] text-[var(--text-secondary)]'}`}
              >
                <i className="fa-solid fa-building-columns mr-2"></i> Bank Transfer
              </button>
            </div>

            {method === 'card' ? (
              <div className="space-y-4">
                <div className="p-4 border border-[var(--bg-hover)] rounded-lg bg-[var(--bg-primary)]">
                   <div className="flex justify-between items-center mb-4">
                     <span className="font-bold text-[var(--text-primary)]">Credit or Debit Card</span>
                     <div className="flex gap-2 text-[var(--text-secondary)]">
                       <i className="fa-brands fa-cc-visa text-xl"></i>
                       <i className="fa-brands fa-cc-mastercard text-xl"></i>
                     </div>
                   </div>
                   <input type="text" placeholder="Card number" className="w-full bg-[var(--bg-secondary)] border border-[var(--bg-hover)] rounded p-3 mb-3 text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
                   <div className="flex gap-3">
                     <input type="text" placeholder="MM / YY" className="w-1/2 bg-[var(--bg-secondary)] border border-[var(--bg-hover)] rounded p-3 text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
                     <input type="text" placeholder="CVC" className="w-1/2 bg-[var(--bg-secondary)] border border-[var(--bg-hover)] rounded p-3 text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
                   </div>
                </div>
                <button 
                  onClick={handleSimulatePayment}
                  disabled={processing}
                  className="w-full bg-[var(--accent)] hover:bg-opacity-90 text-white font-bold py-4 rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  {processing ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Subscribe Now'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="p-6 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
                  <h4 className="font-bold text-yellow-500 mb-2 flex items-center gap-2"><i className="fa-solid fa-triangle-exclamation"></i> Manual Transfer</h4>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Please transfer the subscription amount to the account below. Your account will be upgraded within 24 hours of receipt.
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-[var(--bg-hover)] pb-2">
                      <span className="text-[var(--text-secondary)]">Bank Name</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">United Bank Of Africa</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--bg-hover)] pb-2">
                      <span className="text-[var(--text-secondary)]">Country</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">Liberia</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--bg-hover)] pb-2">
                      <span className="text-[var(--text-secondary)]">Account Name</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">Akin S. Sokpah</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-[var(--text-secondary)]">Account Number</span>
                      <span className="font-mono font-bold text-[var(--accent)] text-lg select-all">53020710015394</span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="w-full border border-[var(--bg-hover)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] font-bold py-3 rounded-lg transition-colors">
                  I have made the transfer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};