
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Share } from "lucide-react";
import { 
  BetslipData, 
  formatDate, 
  formatTime, 
  calculateReturns, 
  formatCurrency,
  calculateTotalOdds,
  downloadBetslip,
  shareBetslip,
  getMarketDisplayText
} from "@/utils/betslipGenerator";

interface BetslipPreviewProps {
  betslip: BetslipData;
}

const BetslipPreview: React.FC<BetslipPreviewProps> = ({ betslip }) => {
  const totalOdds = calculateTotalOdds(betslip.selections);
  const totalReturns = calculateReturns(betslip.stake, totalOdds);
  
  const handleDownload = async () => {
    await downloadBetslip('betslip-preview', `${betslip.bookmaker}-${betslip.receiptNumber}.png`);
  };
  
  const handleShare = async () => {
    await shareBetslip('betslip-preview', `My ${betslip.bookmaker === 'bet365' ? 'bet365' : 'DraftKings'} Betslip`);
  };

  const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share;
  
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
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              {isShareSupported && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="flex items-center gap-1"
                >
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              )}
            </div>
          </div>
          
          {betslip.bookmaker === 'bet365' ? (
            <Bet365BetslipPreview betslip={betslip} totalOdds={totalOdds} totalReturns={totalReturns} />
          ) : (
            <DraftKingsBetslipPreview betslip={betslip} totalOdds={totalOdds} totalReturns={totalReturns} />
          )}
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

const Bet365BetslipPreview: React.FC<BetslipContentProps> = ({ betslip, totalOdds, totalReturns }) => {
  return (
    <div id="betslip-preview" className="betslip">
      <div className="betslip-header">
        <div className="flex items-center">
          <span className="text-xl font-bold">bet365</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs opacity-80">Receipt</span>
          <span className="font-mono text-sm">{betslip.receiptNumber}</span>
        </div>
      </div>
      
      <div className="betslip-content">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Placed: {formatDate(betslip.placedAt)}</span>
          <span>{formatTime(betslip.placedAt)}</span>
        </div>
        
        <div className="bet365-chip bg-bet365-green bg-opacity-10 text-bet365-green">
          {betslip.betType.charAt(0).toUpperCase() + betslip.betType.slice(1)}
        </div>
        
        <Separator className="my-3" />
        
        {betslip.selections.map((selection, index) => (
          <div key={selection.id} className="match-item">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">
                {formatDate(selection.eventDate)} {formatTime(selection.eventDate)}
              </span>
              <span className="font-semibold">{selection.odds.toFixed(2)}</span>
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
              <span className="font-medium">{totalOdds.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Potential Returns</span>
            <span className="font-bold text-bet365-green">{formatCurrency(totalReturns, betslip.currency)}</span>
          </div>
        </div>
      </div>
      
      <div className="betslip-footer">
        <div className="text-xs text-center text-gray-500">
          <p>This is a simulated betslip for entertainment purposes only.</p>
          <p>Not affiliated with bet365.</p>
        </div>
      </div>
    </div>
  );
};

const DraftKingsBetslipPreview: React.FC<BetslipContentProps> = ({ betslip, totalOdds, totalReturns }) => {
  return (
    <div id="betslip-preview" className="betslip dk-betslip">
      <div className="dk-betslip-header">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">DraftKings</span>
          <div className="flex flex-col items-end">
            <span className="text-xs text-white opacity-80">Ticket #</span>
            <span className="font-mono text-sm text-white">{betslip.receiptNumber}</span>
          </div>
        </div>
      </div>
      
      <div className="dk-betslip-content">
        <div className="dk-betslip-info">
          <div className="flex justify-between text-xs text-gray-700">
            <span>Created: {formatDate(betslip.placedAt)} {formatTime(betslip.placedAt)}</span>
          </div>
          
          <div className="dk-chip">
            {betslip.betType.charAt(0).toUpperCase() + betslip.betType.slice(1)}
          </div>
        </div>
        
        <div className="dk-selections">
          {betslip.selections.map((selection, index) => (
            <div key={selection.id} className="dk-selection-item">
              <div className="flex justify-between items-center">
                <span className="font-medium">{selection.homeTeam} vs {selection.awayTeam}</span>
                <span className="text-sm text-gray-600">{formatDate(selection.eventDate)}</span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div>
                  <span className="text-xs text-gray-700">{getMarketDisplayText(selection)}</span>
                  <div className="font-semibold text-dk-blue">{selection.selection}</div>
                </div>
                <div className="dk-odds">
                  <span>{selection.odds > 2 ? `+${Math.round((selection.odds - 1) * 100)}` : `-${Math.round(100 / (selection.odds - 1))}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="dk-bet-details">
          <div className="flex justify-between items-center">
            <span className="text-sm">Wager</span>
            <span className="font-medium">{formatCurrency(betslip.stake, betslip.currency)}</span>
          </div>
          
          {betslip.selections.length > 1 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Odds</span>
              <span className="font-medium">{totalOdds > 2 ? `+${Math.round((totalOdds - 1) * 100)}` : `-${Math.round(100 / (totalOdds - 1))}`}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-semibold">Potential Payout</span>
            <span className="font-bold text-dk-blue">{formatCurrency(totalReturns, betslip.currency)}</span>
          </div>
        </div>
      </div>
      
      <div className="dk-betslip-footer">
        <div className="text-xs text-center text-gray-600">
          <p>This is a simulated betslip for entertainment purposes only.</p>
          <p>Not affiliated with DraftKings.</p>
        </div>
      </div>
    </div>
  );
};

export default BetslipPreview;
