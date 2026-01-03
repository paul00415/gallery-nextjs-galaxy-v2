'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function GoToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={goToTop}
      aria-label="Go to top"
      className="
        fixed
        bottom-20
        right-6
        z-50
        rounded-full
        bg-gray-900
        text-white
        p-3
        shadow-lg
        hover:bg-gray-800
        transition 
        cursor-pointer
      "
    >
      <ArrowUp size={20} />
    </button>
  );
}
