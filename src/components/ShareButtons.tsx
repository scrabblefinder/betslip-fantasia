
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share, Facebook, Twitter, Mail, MessageSquare } from "lucide-react";

interface ShareButtonsProps {
  imageUrl: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ imageUrl }) => {
  // Function to share via Web Share API (for mobile devices)
  const handleNativeShare = async () => {
    try {
      // Check if Web Share API is available
      if (navigator.share) {
        // Convert data URL to blob for sharing
        const blob = await dataUrlToBlob(imageUrl);
        const file = new File([blob], 'betslip.png', { type: 'image/png' });
        
        // Try to share the file
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Check out my betslip!",
            files: [file]
          });
        } else {
          // Fallback to sharing just text/url
          await navigator.share({
            title: "Check out my betslip!",
            text: "Check out my betslip!"
          });
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        toast.info("Direct sharing not supported in this browser. You can download the image instead.");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Failed to share betslip");
    }
  };

  // Convert data URL to Blob
  const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const response = await fetch(dataUrl);
    return await response.blob();
  };

  // Share on specific platforms by downloading or opening the image
  const shareOnSocialMedia = async (platform: 'facebook' | 'twitter' | 'email' | 'sms') => {
    try {
      // First create a blob URL from the data URL for better compatibility
      const blob = await dataUrlToBlob(imageUrl);
      const blobUrl = URL.createObjectURL(blob);
      
      let shareUrl = '';
      const shareText = "Check out my betslip!";
      
      switch (platform) {
        case 'facebook':
          // Facebook doesn't directly support image sharing via URL parameters
          // Instead we open Facebook sharing dialog
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
          window.open(shareUrl, '_blank', 'width=600,height=400');
          toast.info("Please manually upload the image from your downloads");
          // Download the image for the user to upload manually
          downloadImage(blobUrl, 'betslip.png');
          break;
          
        case 'twitter':
          // Twitter also doesn't support direct image sharing via URL
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
          window.open(shareUrl, '_blank', 'width=600,height=400');
          toast.info("Please manually upload the image from your downloads");
          // Download the image for the user to upload manually
          downloadImage(blobUrl, 'betslip.png');
          break;
          
        case 'email':
          // For email, we can create a mailto link (but can't attach the image)
          shareUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText)}`;
          window.location.href = shareUrl;
          // Download the image for the user to attach manually
          downloadImage(blobUrl, 'betslip.png');
          toast.info("Please attach the downloaded image to your email");
          break;
          
        case 'sms':
          // For SMS, we can only send text
          shareUrl = `sms:?body=${encodeURIComponent(shareText)}`;
          window.location.href = shareUrl;
          // Download the image as the user will need to share it separately
          downloadImage(blobUrl, 'betslip.png');
          toast.info("Please attach the downloaded image to your message");
          break;
      }
      
    } catch (error) {
      console.error('Error sharing on platform:', error);
      toast.error(`Failed to share on ${platform}`);
    }
  };
  
  // Helper function to download the image
  const downloadImage = (blobUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Clean up the blob URL after download
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  };

  return (
    <div className="mt-4 mb-4">
      <h3 className="text-sm font-medium mb-2">Share your betslip:</h3>
      
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {/* Native share button (primarily for mobile) */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNativeShare}
          className="flex items-center gap-1"
        >
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>
        
        {/* Social media buttons */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => shareOnSocialMedia('facebook')}
          className="flex items-center gap-1 bg-[#1877F2] text-white hover:bg-[#0E65D9]"
        >
          <Facebook className="h-4 w-4" />
          <span>Facebook</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => shareOnSocialMedia('twitter')}
          className="flex items-center gap-1 bg-[#1DA1F2] text-white hover:bg-[#0C85D0]"
        >
          <Twitter className="h-4 w-4" />
          <span>Twitter</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => shareOnSocialMedia('email')}
          className="flex items-center gap-1"
        >
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => shareOnSocialMedia('sms')}
          className="flex items-center gap-1"
        >
          <MessageSquare className="h-4 w-4" />
          <span>SMS</span>
        </Button>
      </div>
      
      {/* Direct download link */}
      <div className="mt-2 text-center">
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => {
            const downloadBlob = async () => {
              const blob = await dataUrlToBlob(imageUrl);
              const blobUrl = URL.createObjectURL(blob);
              downloadImage(blobUrl, 'betslip.png');
            };
            downloadBlob();
          }}
          className="text-bet365-green hover:text-bet365-green/80"
        >
          Download image
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
