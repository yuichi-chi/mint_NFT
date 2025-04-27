'use client';

import { Web3Provider } from '@/context/Web3Context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Web3Provider>
        {children}
      </Web3Provider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          fontSize: '14px',
          maxWidth: '400px',
        }}
      />
    </>
  );
} 