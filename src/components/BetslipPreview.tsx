import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Share, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ShareButtons from './ShareButtons';
import {
  BetslipData,
  formatDate,
  formatTime,
  calculateReturns,
  formatCurrency,
  calculateTotalOdds,
  downloadBetslip,
  getMarketDisplayText,
  getBookmakerDisplayName,
  formatOdds,
  generateBetslipImage
} from "@/utils/betslipGenerator";

interface BetslipPreviewProps {
  betslip: BetslipData;
}

const BetslipPreview: React.FC<BetslipPreviewProps> = ({ betslip }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareButtons, setShowShareButtons] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  const totalOdds = calculateTotalOdds(betslip.selections);
  const totalReturns = calculateReturns(betslip.stake, totalOdds);
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const bookmakerName = getBookmakerDisplayName(betslip);
      await downloadBetslip('betslip-preview', `${bookmakerName}-${betslip.receiptNumber}.png`);
      toast.success("Betslip downloaded successfully");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download betslip");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleShare = async () => {
    try {
      const dataUrl = await generateBetslipImage('betslip-preview');
      setImageUrl(dataUrl);
      setShowShareButtons(!showShareButtons);
    } catch (error) {
      console.error('Share error:', error);
      toast.error("Failed to prepare betslip for sharing");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mb-4 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Betslip Preview</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-1"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-1"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
          
          {/* ShareThis buttons */}
          {showShareButtons && imageUrl && (
            <div className="mb-4 animate-fade-in">
              <ShareButtons imageUrl={imageUrl} />
            </div>
          )}
          
          <div className="bg-white">
            <CustomBetslipPreview betslip={betslip} totalOdds={totalOdds} totalReturns={totalReturns} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface BetslipContentProps {
  betslip: BetslipData;
  totalOdds: number;
  totalReturns: number;
}

const CustomBetslipPreview: React.FC<BetslipContentProps> = ({ betslip, totalOdds, totalReturns }) => {
  const bookmakerName = getBookmakerDisplayName(betslip);
  
  return (
    <div id="betslip-preview" className="betslip bg-white p-4 rounded-md border border-gray-200">
      <div className="betslip-header flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-xl font-bold">{bookmakerName}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs opacity-80">Receipt</span>
          <span className="font-mono text-sm">{betslip.receiptNumber}</span>
        </div>
      </div>
      
      <div className="betslip-content">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Placed: {formatDate(betslip.placedAt)}</span>
          <span>{formatTime(betslip.placedAt)}</span>
        </div>
        
        <div className="bg-bet365-green bg-opacity-10 text-bet365-green px-2 py-1 text-sm rounded-sm inline-block mb-2">
          {betslip.betType.charAt(0).toUpperCase() + betslip.betType.slice(1)}
        </div>
        
        <Separator className="my-3" />
        
        {betslip.selections.map((selection, index) => (
          <div key={selection.id} className="match-item mb-3 pb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">
                {formatDate(selection.eventDate)} {formatTime(selection.eventDate)}
              </span>
              <span className="font-semibold">{formatOdds(selection.odds, betslip.oddsFormat)}</span>
            </div>
            
            <div className="font-medium mb-1">
              {selection.homeTeam} v {selection.awayTeam}
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">{getMarketDisplayText(selection)}</span>
              <span className="font-semibold text-bet365-green">{selection.selection}</span>
            </div>
          </div>
        ))}
        
        <Separator className="my-3" />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Stake</span>
            <span className="font-medium">{formatCurrency(betslip.stake, betslip.currency)}</span>
          </div>
          
          {betslip.selections.length > 1 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Odds</span>
              <span className="font-medium">{formatOdds(totalOdds, betslip.oddsFormat)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Potential Returns</span>
            <span className="font-bold text-bet365-green">{formatCurrency(totalReturns, betslip.currency)}</span>
          </div>
        </div>
      </div>
      
      <div className="betslip-footer mt-4">
        <div className="text-xs text-center text-gray-500">
          <p>This is a simulated betslip for entertainment purposes only.</p>
          <p>Not affiliated with {bookmakerName}. Generated at Betslip.fyi</p>
        </div>
      </div>
    </div>
  );
};

export default BetslipPreview;
