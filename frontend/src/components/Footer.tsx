'use client';
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 p-4 text-white text-center">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Kathyln Lara Murussi. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}