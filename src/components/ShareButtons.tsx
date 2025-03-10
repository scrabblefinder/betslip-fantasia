
import React, { useEffect } from 'react';

interface ShareButtonsProps {
  imageUrl: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ imageUrl }) => {
  useEffect(() => {
    // Load ShareThis script dynamically
    const script = document.createElement('script');
    script.src = '//platform-api.sharethis.com/js/sharethis.js#property=none&product=inline-share-buttons';
    script.async = true;
    
    // Configure ShareThis
    (window as any).__sharethisConfig = {
      custom: {
        url: imageUrl,
        // Only share the image URL, not the whole page
        image: imageUrl,
        description: 'Check out my betslip!'
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
      delete (window as any).__sharethisConfig;
      const buttonsContainer = document.querySelector('.sharethis-inline-share-buttons');
      if (buttonsContainer) {
        buttonsContainer.remove();
      }
    };
  }, [imageUrl]);

  return <div className="sharethis-inline-share-buttons" />;
};

export default ShareButtons;
