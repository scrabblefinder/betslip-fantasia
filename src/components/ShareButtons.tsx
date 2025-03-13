
import React, { useEffect } from 'react';

interface ShareButtonsProps {
  imageUrl: string;
}

// Add type definition for the ShareThis library
declare global {
  interface Window {
    __sharethis__: {
      load: (product: string, options: any) => void;
    };
  }
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ imageUrl }) => {
  useEffect(() => {
    // Convert data URL to a publicly accessible URL if needed
    // For ShareThis to work properly, we need to use actual URLs, not data URLs
    // Since we're using a data URL (which is very long), we'll set the URL to the current page
    // and use the image for preview only
    
    const shareUrl = window.location.href;
    const shareTitle = "Check out my betslip!";
    
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
        url: shareUrl, // Use the page URL instead of the image data URL
        title: shareTitle,
        description: 'Check out my betslip!',
        image: imageUrl // Keep the image for preview
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
          url: shareUrl, // Use the page URL instead of the image data URL
          title: shareTitle,
          description: 'Check out my betslip!',
          image: imageUrl // Keep the image for preview
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
