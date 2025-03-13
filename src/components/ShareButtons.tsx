
import React, { useEffect } from 'react';

interface ShareButtonsProps {
  imageUrl: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ imageUrl }) => {
  useEffect(() => {
    // Check if ShareThis is already initialized
    if (window.__sharethis__) {
      window.__sharethis__.load('inline-share-buttons', {
        alignment: 'center',
        id: 'my-share-buttons-container',
        enabled: true,
        font_size: 11,
        padding: 8,
        radius: 4,
        networks: ['facebook', 'twitter', 'whatsapp', 'email', 'sms', 'sharethis'],
        size: 32,
        show_mobile_buttons: true,
        url: imageUrl,
        image: imageUrl,
        description: 'Check out my betslip!'
      });
      return;
    }

    // If ShareThis isn't loaded yet, initialize it
    const script = document.createElement('script');
    script.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=67cf2a0f6eb4310012fddafd&product=inline-share-buttons';
    script.async = true;
    script.onload = () => {
      if (window.__sharethis__) {
        window.__sharethis__.load('inline-share-buttons', {
          alignment: 'center',
          id: 'my-share-buttons-container',
          enabled: true,
          font_size: 11,
          padding: 8,
          radius: 4,
          networks: ['facebook', 'twitter', 'whatsapp', 'email', 'sms', 'sharethis'],
          size: 32,
          show_mobile_buttons: true,
          url: imageUrl,
          image: imageUrl,
          description: 'Check out my betslip!'
        });
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Cleanup when component unmounts
      const buttons = document.getElementById('my-share-buttons-container');
      if (buttons) {
        buttons.innerHTML = '';
      }
    };
  }, [imageUrl]);

  return (
    <div className="mt-4 mb-4">
      <h3 className="text-sm font-medium mb-2">Share your betslip:</h3>
      <div id="my-share-buttons-container"></div>
    </div>
  );
};

export default ShareButtons;
