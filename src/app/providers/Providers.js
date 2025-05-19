'use client'

import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from '@components/Layout';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Layout>
        {children}
        <Toaster position="top-right" />
      </Layout>
    </AuthProvider>
  );
}
