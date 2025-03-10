// Format date to display in betslip
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Format time to display in betslip
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate a random receipt number
export const generateReceiptNumber = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Calculate potential returns based on stake and odds
export const calculateReturns = (stake: number, odds: number): number => {
  return parseFloat((stake * odds).toFixed(2));
};

// Format currency with support for multiple currencies
export const formatCurrency = (amount: number, currency: string = "GBP"): string => {
  const currencyMap: Record<string, string> = {
    "GBP": "GBP",
    "USD": "USD",
    "EUR": "EUR"
  };
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyMap[currency] || "GBP",
    minimumFractionDigits: 2
  }).format(amount);
};

// Convert decimal odds to American odds
export const decimalToAmerican = (decimalOdds: number): string => {
  if (decimalOdds === 1) return "0";
  
  if (decimalOdds >= 2) {
    // Positive American odds (underdog)
    return "+" + Math.round((decimalOdds - 1) * 100);
  } else {
    // Negative American odds (favorite)
    return Math.round(-100 / (decimalOdds - 1)).toString();
  }
};

// Convert American odds to decimal odds
export const americanToDecimal = (americanOdds: string): number => {
  const odds = parseInt(americanOdds);
  
  if (odds === 0) return 1;
  
  if (odds > 0) {
    // Positive American odds (underdog)
    return parseFloat(((odds / 100) + 1).toFixed(2));
  } else {
    // Negative American odds (favorite)
    return parseFloat(((-100 / odds) + 1).toFixed(2));
  }
};

// Format odds based on selected format
export const formatOdds = (decimalOdds: number, format: OddsFormat): string => {
  if (format === 'decimal') {
    return decimalOdds.toFixed(2);
  } else {
    return decimalToAmerican(decimalOdds);
  }
};

export interface BetSelection {
  id: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  customMarket?: string;
  selection: string;
  odds: number;
  eventDate: Date;
}

// Update Bookmaker type to only have 'custom'
export type Bookmaker = 'custom';

// Add OddsFormat type
export type OddsFormat = 'decimal' | 'american';

export interface BetslipData {
  selections: BetSelection[];
  stake: number;
  betType: string;
  placedAt: Date;
  receiptNumber: string;
  bookmaker: Bookmaker;
  customBookmakerName: string;
  currency: string;
  oddsFormat: OddsFormat;
}

// Create a blank betslip with default values
export const createBlankBetslip = (): BetslipData => {
  return {
    selections: [createBlankSelection()],
    stake: 10,
    betType: 'single',
    placedAt: new Date(),
    receiptNumber: generateReceiptNumber(),
    bookmaker: 'custom',
    customBookmakerName: 'Your Bookmaker',
    currency: 'GBP',
    oddsFormat: 'decimal'
  };
};

// Create a blank selection
export const createBlankSelection = (): BetSelection => {
  return {
    id: crypto.randomUUID(),
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    market: 'Match Result',
    selection: 'Manchester United',
    odds: 2.5,
    eventDate: new Date()
  };
};

// Add a new blank selection to betslip
export const addSelection = (betslip: BetslipData): BetslipData => {
  return {
    ...betslip,
    selections: [...betslip.selections, createBlankSelection()]
  };
};

// Remove a selection from betslip
export const removeSelection = (betslip: BetslipData, id: string): BetslipData => {
  return {
    ...betslip,
    selections: betslip.selections.filter(selection => selection.id !== id)
  };
};

// Get the display market text (use custom market if available)
export const getMarketDisplayText = (selection: BetSelection): string => {
  return selection.market === 'Custom' && selection.customMarket 
    ? selection.customMarket 
    : selection.market;
};

// Get the display bookmaker name
export const getBookmakerDisplayName = (betslip: BetslipData): string => {
  return betslip.customBookmakerName || 'Your Bookmaker';
};

// Calculate total odds for accumulator
export const calculateTotalOdds = (selections: BetSelection[]): number => {
  if (selections.length === 0) return 0;
  
  return parseFloat(selections.reduce((total, selection) => {
    return total * selection.odds;
  }, 1).toFixed(2));
};

// Convert betslip to image and download
export const downloadBetslip = async (elementId: string, filename: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      }
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating image:', error);
  }
};

// Share betslip (for mobile devices)
export const shareBetslip = async (elementId: string, title: string): Promise<void> => {
  try {
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      }
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'betslip.png', { type: 'image/png' });

    await navigator.share({
      title,
      files: [file]
    });
  } catch (error) {
    console.error('Error sharing betslip:', error);
  }
};
