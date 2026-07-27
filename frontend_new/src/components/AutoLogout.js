'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoLogout({ timeoutMinutes = 5 }) {
  const router = useRouter();
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set timer to log out after X minutes of inactivity
    timeoutRef.current = setTimeout(() => {
      // Per the user request, automatically log out
      router.push('/login');
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    // Events that denote user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetTimer();
    };

    // Initialize the timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [router, timeoutMinutes]);

  return null; // This component doesn't render anything visible
}
