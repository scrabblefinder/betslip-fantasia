import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Share, Check, ChevronDown } from "lucide-react";
import { 
  BetslipData, 
  formatDate, 
  formatTime, 
  calculateReturns, 
  formatCurrency,
  calculateTotalOdds,
  downloadBetslip,
  shareBetslip,
  getMarketDisplayText,
  formatDateBetMGM,
  formatTimeBetMGM
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
    await shareBetslip('betslip-preview', `My ${betslip.bookmaker === 'bet365' ? 'bet365' : betslip.bookmaker === 'draftkings' ? 'DraftKings' : 'BetMGM'} Betslip`);
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
          ) : betslip.bookmaker === 'draftkings' ? (
            <DraftKingsBetslipPreview betslip={betslip} totalOdds={totalOdds} totalReturns={totalReturns} />
          ) : (
            <BetMGMBetslipPreview betslip={betslip} totalOdds={totalOdds} totalReturns={totalReturns} />
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
        <div className="flex items-center justify-between py-2 px-4">
          <span className="text-xl font-bold text-white">DraftKings</span>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">Receipt</span>
            <span className="font-mono text-sm text-white">{betslip.receiptNumber}</span>
          </div>
        </div>
      </div>
      
      <div className="dk-betslip-content">
        <div className="dk-selections">
          {betslip.selections.map((selection, index) => (
            <div key={selection.id} className={`dk-selection-item ${index === 0 ? 'border-t-0' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="dk-check-icon">
                    <Check className="h-4 w-4 text-black" />
                  </div>
                  <div className="dk-selection-title">{selection.selection}</div>
                </div>
                <div className="dk-odds">
                  {selection.odds >= 2 ? 
                    `+${Math.round((selection.odds - 1) * 100)}` : 
                    `−${Math.round(100 / (selection.odds - 1))}`}
                </div>
              </div>
              <div className="dk-selection-subtitle">
                {selection.market.toUpperCase()}
              </div>
              <div className="dk-selection-matchup">
                {selection.homeTeam} vs {selection.awayTeam} • {formatTime(selection.eventDate)}
              </div>
              {betslip.betType !== 'single' && (
                <div className="dk-selection-result">Result: {Math.floor(Math.random() * 100)} : {Math.floor(Math.random() * 100)}</div>
              )}
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
              <span className="font-medium">
                {totalOdds >= 2 ? 
                  `+${Math.round((totalOdds - 1) * 100)}` : 
                  `−${Math.round(100 / (totalOdds - 1))}`}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Potential Payout</span>
            <span className="font-bold text-dk-blue">{formatCurrency(totalReturns, betslip.currency)}</span>
          </div>
        </div>
      </div>
      
      <div className="dk-receipt">
        <span>Receipt# {betslip.receiptNumber}</span>
      </div>
      
      <div className="dk-betslip-footer">
        <div className="text-xs text-center text-gray-400">
          <p>This is a simulated betslip for entertainment purposes only.</p>
          <p>Not affiliated with DraftKings.</p>
        </div>
      </div>
    </div>
  );
};

const BetMGMBetslipPreview: React.FC<BetslipContentProps> = ({ betslip, totalOdds, totalReturns }) => {
  const numSelections = betslip.selections.length;
  
  return (
    <div id="betslip-preview" className="betslip mgm-betslip rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="mgm-betslip-header bg-gray-100 p-4 flex justify-between items-center">
        <h3 className="text-3xl font-semibold text-gray-700">My Bets</h3>
        <div className="border rounded-full px-6 py-2">
          <span className="text-gray-600 text-xl">Close</span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mgm-betslip-tabs flex text-center border-b">
        <div className="p-4 w-1/3 text-xl text-gray-500">
          Live <span className="text-red-500">1</span>
        </div>
        <div className="p-4 w-1/3 text-xl font-bold border-b-2 border-black">
          Open <span className="text-blue-500">{numSelections}</span>
        </div>
        <div className="p-4 w-1/3 text-xl text-gray-500">
          Settled
        </div>
      </div>
      
      {/* Bet Content */}
      <div className="mgm-betslip-content p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="bg-amber-100 rounded-lg border border-amber-200 p-1 mr-2">
              <span className="font-bold">SGP</span>
            </div>
            <span className="text-2xl font-bold">{numSelections} {numSelections === 1 ? 'Leg' : 'Legs'}</span>
          </div>
          <span className="text-3xl font-bold">{totalOdds.toFixed(2)}</span>
        </div>
        
        <div className="text-gray-600 text-lg mb-2">
          {betslip.selections.map((selection, index) => (
            <React.Fragment key={`header-${selection.id}`}>
              {getMarketDisplayText(selection)}
              {index < betslip.selections.length - 1 && " | "}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mb-4 text-blue-600 flex items-center cursor-pointer">
          <span className="text-xl">Hide legs</span>
          <ChevronDown className="ml-1 h-5 w-5" />
        </div>
        
        {/* Selections */}
        {betslip.selections.map((selection, index) => (
          <div key={selection.id} className="mgm-selection mb-3">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0 mr-4"></div>
              <div className="text-xl font-bold">
                {getMarketDisplayText(selection)}
              </div>
            </div>
            <div className="ml-10 text-xl font-bold">
              {selection.selection}
            </div>
            <div className="ml-10 text-lg mt-1">
              {selection.homeTeam} - {selection.awayTeam}
            </div>
            <div className="ml-10 text-lg text-gray-600">
              {formatDateBetMGM(selection.eventDate)} • {formatTimeBetMGM(selection.eventDate)}
            </div>
          </div>
        ))}
        
        {/* Stake and Payout */}
        <div className="border-t border-b py-4 my-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xl">Stake:</span>
            <span className="text-2xl font-bold">${betslip.stake.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xl">Potential payout:</span>
            <span className="text-2xl font-bold">${totalReturns.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Cash Out Section */}
        <div className="bg-gray-200 rounded-lg p-4 text-center text-gray-500 text-xl mb-2">
          Cash Out Unavailable
        </div>
        
        <div className="text-gray-500 text-lg text-center">
          Cash Out not available for one or more events in your bet
        </div>
      </div>
    </div>
  );
};

export default BetslipPreview;
