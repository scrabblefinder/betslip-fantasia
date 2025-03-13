
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
    // For ShareThis to work properly, we need a public URL for the image
    // Since we're using a data URL, we'll create a temporary blob URL which works better
    // for some sharing scenarios (but still has limitations)
    
    let blobUrl = '';
    
    // Convert data URL to Blob URL for better compatibility
    const convertDataUrlToBlob = async (dataUrl: string) => {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error converting data URL to blob:', error);
        return '';
      }
    };
    
    const setupShareButtons = async () => {
      try {
        // Convert to blob URL if possible
        blobUrl = await convertDataUrlToBlob(imageUrl);
        
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
            url: shareUrl, // Use the page URL for sharing
            title: shareTitle,
            description: 'Check out my betslip!',
            image: blobUrl || imageUrl // Use blob URL if available, fall back to data URL
          });
        } else {
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
                url: shareUrl, // Use the page URL for sharing
                title: shareTitle,
                description: 'Check out my betslip!',
                image: blobUrl || imageUrl // Use blob URL if available, fall back to data URL
              });
            }
          };
          
          document.body.appendChild(script);
        }
      } catch (error) {
        console.error('Error setting up share buttons:', error);
      }
    };
    
    setupShareButtons();
    
    return () => {
      // Cleanup when component unmounts
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl); // Clean up the blob URL
      }
      
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
      
      {/* Add a direct download link as an alternative */}
      <div className="mt-2 text-xs text-center text-gray-500">
        <p>
          If sharing doesn't work, you can still 
          <a 
            href={imageUrl} 
            download="betslip.png" 
            className="text-bet365-green ml-1 hover:underline"
          >
            download the image
          </a> 
          and share it manually.
        </p>
      </div>
    </div>
  );
};

export default ShareButtons;
