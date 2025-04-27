'use client';

import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-6 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-white/50 text-sm">
          © 2024 NFT Mint. All rights reserved.
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yourusername/nft-mint"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors duration-200"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
} 