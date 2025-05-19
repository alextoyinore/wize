'use client'

import { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

