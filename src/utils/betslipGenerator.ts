
// Format date to display in betslip
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Format date for BetMGM style (M/D/YY)
export const formatDateBetMGM = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit'
  });
};

// Format time to display in betslip
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format time for BetMGM style (H:MM AM/PM)
export const formatTimeBetMGM = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
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
    "GBP": "GBP",
    "USD": "USD"
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
  customMarket?: string; // New field for custom market text
  selection: string;
  odds: number;
  eventDate: Date;
}

export type Bookmaker = 'bet365' | 'draftkings' | 'betmgm';

export interface BetslipData {
  selections: BetSelection[];
  stake: number;
  betType: string; // single, double, accumulator
  placedAt: Date;
  receiptNumber: string;
  bookmaker: Bookmaker;
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
    bookmaker: 'bet365',
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
    
    // Create a deep clone of the element
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Apply styles for proper rendering
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = element.offsetWidth + 'px';
    clone.style.height = element.offsetHeight + 'px';
    clone.style.zIndex = '-9999';
    clone.style.backgroundColor = 'white';
    
    // Fix all child elements to ensure exact rendering
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el) => {
      const element = el as HTMLElement;
      const computedStyle = window.getComputedStyle(element);
      
      // Remove backdrop filters
      if (computedStyle.backdropFilter) {
        element.style.backdropFilter = 'none';
      }
      
      // Ensure full opacity
      element.style.opacity = '1';
      
      // Convert all rgba to rgb to prevent transparency issues
      if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('rgba')) {
        const rgba = computedStyle.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
        if (rgba) {
          element.style.backgroundColor = `rgb(${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
        }
      }
      
      // Fix text colors that might be using rgba
      if (computedStyle.color && computedStyle.color.includes('rgba')) {
        const rgba = computedStyle.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
        if (rgba) {
          element.style.color = `rgb(${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
        }
      }
      
      // Fix border colors
      if (computedStyle.borderColor && computedStyle.borderColor.includes('rgba')) {
        const rgba = computedStyle.borderColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
        if (rgba) {
          element.style.borderColor = `rgb(${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
        }
      }
      
      // Ensure full saturation of colors for bet365 green elements
      if (element.classList.contains('text-bet365-green') || 
          (computedStyle.color === 'rgb(30, 126, 52)' || computedStyle.color === 'rgba(30, 126, 52, 0.8)')) {
        element.style.color = 'rgb(30, 126, 52)';
      }
      
      // Fix DraftKings blue elements
      if (element.classList.contains('text-dk-blue')) {
        element.style.color = 'rgb(0, 221, 0)';
      }
      
      // Fix any background opacity issues with bet365 green
      if (element.classList.contains('bg-bet365-green') || 
          computedStyle.backgroundColor === 'rgba(30, 126, 52, 0.1)') {
        element.style.backgroundColor = 'rgb(30, 126, 52)';
        // If it's supposed to be light green (like chips)
        if (element.classList.contains('bg-opacity-10')) {
          element.style.backgroundColor = 'rgba(30, 126, 52, 0.1)';
          // Force full saturation for download
          element.style.backgroundColor = 'rgb(235, 247, 238)';
        }
      }
    });
    
    // Append to document temporarily
    document.body.appendChild(clone);
    
    // Capture with enhanced settings
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      removeContainer: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        // Additional fixes in the clone document
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Ensure all text is fully opaque
          const textElements = clonedElement.querySelectorAll('*');
          textElements.forEach((el) => {
            (el as HTMLElement).style.color = (el as HTMLElement).style.color.replace('rgba', 'rgb').replace(/,[^)]+\)/, ')');
          });
        }
      }
    });
    
    // Remove the clone from the document
    document.body.removeChild(clone);
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0); // Use maximum quality
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
    
    // Create a deep clone of the element
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Apply styles for proper rendering
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = element.offsetWidth + 'px';
    clone.style.height = element.offsetHeight + 'px';
    clone.style.zIndex = '-9999';
    clone.style.backgroundColor = 'white';
    
    // Fix all child elements to ensure exact rendering
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el) => {
      const element = el as HTMLElement;
      const computedStyle = window.getComputedStyle(element);
      
      // Remove backdrop filters
      if (computedStyle.backdropFilter) {
        element.style.backdropFilter = 'none';
      }
      
      // Ensure full opacity
      element.style.opacity = '1';
      
      // Convert all rgba to rgb to prevent transparency issues
      if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('rgba')) {
        const rgba = computedStyle.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
        if (rgba) {
          element.style.backgroundColor = `rgb(${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
        }
      }
      
      // Fix text colors that might be using rgba
      if (computedStyle.color && computedStyle.color.includes('rgba')) {
        const rgba = computedStyle.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
        if (rgba) {
          element.style.color = `rgb(${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
        }
      }
      
      // Fix border colors
      if (computedStyle.borderColor && computedStyle.borderColor.includes('rgba')) {
        const rgba = computedStyle.borderColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d*\.)?\d+)?\)/);
        if (rgba) {
          element.style.borderColor = `rgb(${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
        }
      }
      
      // Ensure full saturation of colors for bet365 green elements
      if (element.classList.contains('text-bet365-green') || 
          (computedStyle.color === 'rgb(30, 126, 52)' || computedStyle.color === 'rgba(30, 126, 52, 0.8)')) {
        element.style.color = 'rgb(30, 126, 52)';
      }
      
      // Fix DraftKings blue elements
      if (element.classList.contains('text-dk-blue')) {
        element.style.color = 'rgb(0, 221, 0)';
      }
      
      // Fix any background opacity issues with bet365 green
      if (element.classList.contains('bg-bet365-green') || 
          computedStyle.backgroundColor === 'rgba(30, 126, 52, 0.1)') {
        element.style.backgroundColor = 'rgb(30, 126, 52)';
        // If it's supposed to be light green (like chips)
        if (element.classList.contains('bg-opacity-10')) {
          element.style.backgroundColor = 'rgba(30, 126, 52, 0.1)';
          // Force full saturation for download
          element.style.backgroundColor = 'rgb(235, 247, 238)';
        }
      }
    });
    
    // Append to document temporarily
    document.body.appendChild(clone);
    
    // Capture with enhanced settings
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      removeContainer: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        // Additional fixes in the clone document
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Ensure all text is fully opaque
          const textElements = clonedElement.querySelectorAll('*');
          textElements.forEach((el) => {
            (el as HTMLElement).style.color = (el as HTMLElement).style.color.replace('rgba', 'rgb').replace(/,[^)]+\)/, ')');
          });
        }
      }
    });
    
    // Remove the clone from the document
    document.body.removeChild(clone);
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      
      const file = new File([blob], 'betslip.png', { type: 'image/png' });
      
      await navigator.share({
        title,
        files: [file]
      });
    }, 'image/png', 1.0); // Use maximum quality
    
  } catch (error) {
    console.error('Error sharing betslip:', error);
  }
};
