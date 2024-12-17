import React from 'react';
import { Linkedin } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Linkedin className="w-8 h-8 text-[#0077b5]" />
        <h1 className="text-3xl font-bold text-gray-800">LinkedIn Post Optimizer</h1>
      </div>
      <p className="text-gray-600">Transform your content into engaging LinkedIn posts</p>
    </div>
  );
}