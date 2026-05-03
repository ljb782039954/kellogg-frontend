import { useEffect } from 'react';

/**
 * Tawk.to Live Chat Widget Component
 * This component injects the Tawk.to script into the page.
 */
export default function TawkChat() {
  useEffect(() => {
    // Prevent multiple injections
    if (document.getElementById('tawk-script')) return;

    const tawk_api = (window as any).Tawk_API || {};
    const tawk_load_start = new Date();
    (window as any).Tawk_API = tawk_api;
    (window as any).Tawk_LoadStart = tawk_load_start;

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    
    s1.id = 'tawk-script';
    s1.async = true;
    s1.src = 'https://embed.tawk.to/69f7493d0b9cc71c320940a8/1jnmvc6gf';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  return null;
}
