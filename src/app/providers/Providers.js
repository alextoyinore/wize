'use client'

import { Toaster } from 'react-hot-toast';
import Layout from '@components/Layout';

export default function Providers({ children }) {
  return (
      <Layout>
        {children}
        <Toaster position="top-right" />
      </Layout>
  );
}

