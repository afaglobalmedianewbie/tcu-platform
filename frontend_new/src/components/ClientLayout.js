'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from './ChatBot';
import { LanguageProvider } from './LanguageContext';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));
  
  // Safely hide public Navbar & Footer on all dashboard, admin, customer, technician, noc, login, and register app routes
  const isAppRoute = pathname.startsWith('/admin') || 
                     pathname.startsWith('/dashboard') || 
                     pathname.startsWith('/customer') || 
                     pathname.startsWith('/technician') || 
                     pathname.startsWith('/noc') || 
                     pathname.startsWith('/teknisi') ||
                     pathname.startsWith('/login') ||
                     pathname.startsWith('/register');

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        {!isAppRoute && <Navbar />}
        <main>{children}</main>
        {!isAppRoute && <Footer />}
        {/* Global Chatbot — shown on all public landing pages only */}
        {!isAppRoute && <ChatBot />}
      </LanguageProvider>
    </QueryClientProvider>
  );
}
