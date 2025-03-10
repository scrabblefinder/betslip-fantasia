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

// Format currency 
export const formatCurrency = (amount: number, currency: string = "GBP"): string => {
  const currencyMap: Record<string, string> = {
    "GBP": "GBP"
  };
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyMap[currency] || "GBP",
    minimumFractionDigits: 2
  }).format(amount);
};

export interface BetSelection {
  id: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  customMarket?: string; // Field for custom market text
  selection: string;
  odds: number;
  eventDate: Date;
}

// Update Bookmaker type to only have 'custom'
export type Bookmaker = 'custom';

export interface BetslipData {
  selections: BetSelection[];
  stake: number;
  betType: string; // single, double, accumulator
  placedAt: Date;
  receiptNumber: string;
  bookmaker: Bookmaker;
  customBookmakerName: string; // No longer optional
  currency: string;
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
    customBookmakerName: 'Your Bookmaker', // Default name
    currency: 'GBP'
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
    const html2canvas = (await import('html2canvas')).default;
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error('Element not found');
    }
    
    // Create a clone to manipulate without affecting the displayed element
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Set up styles for optimal rendering
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = element.offsetWidth + 'px';
    clone.style.height = element.offsetHeight + 'px';
    clone.style.zIndex = '-9999';
    clone.style.backgroundColor = '#ffffff';
    clone.style.opacity = '1';
    
    // Fix all child elements to ensure exact rendering
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el) => {
      const element = el as HTMLElement;
      
      // Force full opacity
      element.style.opacity = '1';
      
      // Remove any backdrop filters
      element.style.backdropFilter = 'none';
      
      // Handle background colors - convert any rgba to solid rgb
      if (element.style.backgroundColor || getComputedStyle(element).backgroundColor) {
        const bgColor = element.style.backgroundColor || getComputedStyle(element).backgroundColor;
        if (bgColor.includes('rgba')) {
          const rgbaMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
          if (rgbaMatch) {
            element.style.backgroundColor = `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
          }
        }
      }
      
      // Fix text colors - convert any rgba to solid rgb
      if (element.style.color || getComputedStyle(element).color) {
        const color = element.style.color || getComputedStyle(element).color;
        if (color.includes('rgba')) {
          const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
          if (rgbaMatch) {
            element.style.color = `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
          }
        }
      }
      
      // Fix borders - convert any rgba to solid rgb
      if (element.style.borderColor || getComputedStyle(element).borderColor) {
        const borderColor = element.style.borderColor || getComputedStyle(element).borderColor;
        if (borderColor.includes('rgba')) {
          const rgbaMatch = borderColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
          if (rgbaMatch) {
            element.style.borderColor = `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
          }
        }
      }
      
      // Specifically handle bet365 green elements
      if (element.classList.contains('bg-bet365-green')) {
        element.style.backgroundColor = 'rgb(30, 126, 52)';
      }
      
      if (element.classList.contains('text-bet365-green')) {
        element.style.color = 'rgb(30, 126, 52)';
      }
    });
    
    // Append the clone to the body temporarily
    document.body.appendChild(clone);
    
    // Use html2canvas with enhanced settings
    const canvas = await html2canvas(clone, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff',
      allowTaint: true,
      logging: false,
      imageTimeout: 0,
      removeContainer: true,
      onclone: (clonedDoc) => {
        const cloneInDoc = clonedDoc.body.querySelector(`#${elementId}`);
        if (cloneInDoc) {
          // Apply additional fixes to the cloned document
          const allTextElems = cloneInDoc.querySelectorAll('*');
          allTextElems.forEach((el) => {
            const element = el as HTMLElement;
            element.style.opacity = '1';
          });
        }
      }
    });
    
    // Remove the clone after capture
    document.body.removeChild(clone);
    
    // Create download link with high quality PNG
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    
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
    
    const html2canvas = (await import('html2canvas')).default;
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error('Element not found');
    }
    
    // Create a clone to manipulate without affecting the displayed element
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Set up styles for optimal rendering
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = element.offsetWidth + 'px';
    clone.style.height = element.offsetHeight + 'px';
    clone.style.zIndex = '-9999';
    clone.style.backgroundColor = '#ffffff';
    clone.style.opacity = '1';
    
    // Fix all child elements to ensure exact rendering
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el) => {
      const element = el as HTMLElement;
      
      // Force full opacity
      element.style.opacity = '1';
      
      // Remove any backdrop filters
      element.style.backdropFilter = 'none';
      
      // Handle background colors - convert any rgba to solid rgb
      if (element.style.backgroundColor || getComputedStyle(element).backgroundColor) {
        const bgColor = element.style.backgroundColor || getComputedStyle(element).backgroundColor;
        if (bgColor.includes('rgba')) {
          const rgbaMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
          if (rgbaMatch) {
            element.style.backgroundColor = `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
          }
        }
      }
      
      // Fix text colors - convert any rgba to solid rgb
      if (element.style.color || getComputedStyle(element).color) {
        const color = element.style.color || getComputedStyle(element).color;
        if (color.includes('rgba')) {
          const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
          if (rgbaMatch) {
            element.style.color = `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
          }
        }
      }
      
      // Fix borders - convert any rgba to solid rgb
      if (element.style.borderColor || getComputedStyle(element).borderColor) {
        const borderColor = element.style.borderColor || getComputedStyle(element).borderColor;
        if (borderColor.includes('rgba')) {
          const rgbaMatch = borderColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
          if (rgbaMatch) {
            element.style.borderColor = `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
          }
        }
      }
      
      // Specifically handle bet365 green elements
      if (element.classList.contains('bg-bet365-green')) {
        element.style.backgroundColor = 'rgb(30, 126, 52)';
      }
      
      if (element.classList.contains('text-bet365-green')) {
        element.style.color = 'rgb(30, 126, 52)';
      }
    });
    
    // Append the clone to the body temporarily
    document.body.appendChild(clone);
    
    // Use html2canvas with enhanced settings
    const canvas = await html2canvas(clone, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff',
      allowTaint: true,
      logging: false,
      imageTimeout: 0,
      removeContainer: true,
      onclone: (clonedDoc) => {
        const cloneInDoc = clonedDoc.body.querySelector(`#${elementId}`);
        if (cloneInDoc) {
          // Apply additional fixes to the cloned document
          const allTextElems = cloneInDoc.querySelectorAll('*');
          allTextElems.forEach((el) => {
            const element = el as HTMLElement;
            element.style.opacity = '1';
          });
        }
      }
    });
    
    // Remove the clone after capture
    document.body.removeChild(clone);
    
    // Create blob for sharing with high quality
    canvas.toBlob(async (blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      
      const file = new File([blob], 'betslip.png', { type: 'image/png' });
      
      await navigator.share({
        title,
        files: [file]
      });
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('Error sharing betslip:', error);
  }
};
