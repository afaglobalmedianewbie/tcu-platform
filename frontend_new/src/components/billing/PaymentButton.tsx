'use client';
import React from 'react';

interface PaymentButtonProps {
  invoiceId: string;
  amount: number;
  onSuccess?: () => void;
}

export default function PaymentButton({
  invoiceId,
  amount,
  onSuccess
}: PaymentButtonProps) {

  const handleRedirect = () => {
    // Simulated redirect link mapping for XenPlatform Type OWNED Xendit Sub-Account
    console.log(`Initiating Xendit session for invoice ${invoiceId} totaling Rp${amount}`);
    alert(`Mengalihkan ke Gerbang Pembayaran Xendit (Simulasi). ID: ${invoiceId}`);
    
    // Simulate successful webhook callback callback logic
    if (onSuccess) {
      setTimeout(() => onSuccess(), 2000);
    }
  };

  return (
    <button
      onClick={handleRedirect}
      className="py-2 px-4 bg-[#7B4DFF] hover:bg-[#7b4dff]/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7B4DFF]/15 hover:shadow-[#7B4DFF]/30 transition duration-150"
    >
      Bayar Tagihan via Xendit
    </button>
  );
}
