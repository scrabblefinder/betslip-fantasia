
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
        const response = await fetch(imageUrl);
        const blob = await response.blob();
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
            text: "Check out my betslip!",
            url: window.location.href
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

  // Share on specific platforms
  const shareOnSocialMedia = (platform: 'facebook' | 'twitter' | 'email' | 'sms') => {
    try {
      let shareUrl = '';
      const pageUrl = window.location.href;
      const shareText = "Check out my betslip!";
      
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText + '\n\n' + pageUrl)}`;
          break;
        case 'sms':
          shareUrl = `sms:?body=${encodeURIComponent(shareText + ' ' + pageUrl)}`;
          break;
      }
      
      // Open in new window/tab
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error sharing on platform:', error);
      toast.error(`Failed to share on ${platform}`);
    }
  };

  const downloadImage = () => {
    // Create a download link and click it
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'betslip.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Image downloaded successfully");
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
      
      {/* Direct download link as fallback */}
      <div className="mt-2 text-center">
        <Button 
          variant="link" 
          size="sm" 
          onClick={downloadImage}
          className="text-bet365-green hover:text-bet365-green/80"
        >
          Download image
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
