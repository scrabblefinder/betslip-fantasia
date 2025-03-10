
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  initBetslipGenerator();
});

function initBetslipGenerator() {
  // Set current date/time for the placed at input
  const now = new Date();
  const placedAtInput = document.getElementById('placedAtInput');
  placedAtInput.value = formatDateForInput(now);
  
  // Generate random receipt number
  const receiptInput = document.getElementById('receiptInput');
  receiptInput.value = generateReceiptNumber();
  
  // Initialize event listeners
  initEventListeners();
  
  // Initial update of the preview
  updateBetslipPreview();
}

function initEventListeners() {
  // Form inputs
  const betslipForm = document.getElementById('betslipForm');
  betslipForm.addEventListener('input', updateBetslipPreview);
  
  // Add selection button
  const addSelectionBtn = document.getElementById('addSelectionBtn');
  addSelectionBtn.addEventListener('click', addSelectionRow);
  
  // Download button
  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.addEventListener('click', downloadBetslip);
  
  // Share button
  const shareBtn = document.getElementById('shareBtn');
  shareBtn.addEventListener('click', toggleShareButtons);
  
  // Share buttons
  const facebookBtn = document.querySelector('.share-btn.facebook');
  facebookBtn.addEventListener('click', () => shareOnSocialMedia('facebook'));
  
  const twitterBtn = document.querySelector('.share-btn.twitter');
  twitterBtn.addEventListener('click', () => shareOnSocialMedia('twitter'));
  
  const whatsappBtn = document.querySelector('.share-btn.whatsapp');
  whatsappBtn.addEventListener('click', () => shareOnSocialMedia('whatsapp'));
}

function addSelectionRow() {
  const selectionsContainer = document.getElementById('selectionsContainer');
  const newRow = document.createElement('div');
  newRow.className = 'selection-row mb-4 p-4 border border-gray-200 rounded-md';
  
  // Create a template for the new selection row
  newRow.innerHTML = `
    <div class="flex justify-between mb-2">
      <div></div>
      <button type="button" class="remove-selection text-gray-400 hover:text-red-500">✕</button>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="form-group">
        <label class="block text-sm font-medium mb-1">Home Team</label>
        <input type="text" class="home-team bet365-input" value="Arsenal">
      </div>
      <div class="form-group">
        <label class="block text-sm font-medium mb-1">Away Team</label>
        <input type="text" class="away-team bet365-input" value="Chelsea">
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-3">
      <div class="form-group">
        <label class="block text-sm font-medium mb-1">Market</label>
        <select class="market bet365-input">
          <option value="Match Result">Match Result</option>
          <option value="Both Teams To Score">Both Teams To Score</option>
          <option value="Over/Under">Over/Under</option>
          <option value="Correct Score">Correct Score</option>
          <option value="Custom">Custom</option>
        </select>
      </div>
      <div class="form-group">
        <label class="block text-sm font-medium mb-1">Selection</label>
        <input type="text" class="selection bet365-input" value="Arsenal">
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-3">
      <div class="form-group">
        <label class="block text-sm font-medium mb-1">Odds</label>
        <input type="number" step="0.01" min="1.01" class="odds bet365-input" value="1.95">
      </div>
      <div class="form-group">
        <label class="block text-sm font-medium mb-1">Event Date</label>
        <input type="datetime-local" class="event-date bet365-input" value="${formatDateForInput(new Date())}">
      </div>
    </div>
  `;
  
  // Add event listener to the remove button
  selectionsContainer.appendChild(newRow);
  
  const removeBtn = newRow.querySelector('.remove-selection');
  removeBtn.addEventListener('click', function() {
    selectionsContainer.removeChild(newRow);
    updateBetslipPreview();
  });
  
  // Add input event listeners to the new row
  const inputs = newRow.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('input', updateBetslipPreview);
  });
  
  updateBetslipPreview();
}

function updateBetslipPreview() {
  // Update bookmaker name
  const bookmakerName = document.getElementById('bookmakerName').value;
  document.getElementById('preview-bookmaker').textContent = bookmakerName;
  document.getElementById('preview-disclaimer').textContent = `Not affiliated with ${bookmakerName}.`;
  
  // Update receipt number
  const receiptNumber = document.getElementById('receiptInput').value;
  document.getElementById('preview-receipt').textContent = receiptNumber;
  
  // Update date and time
  const placedAt = new Date(document.getElementById('placedAtInput').value);
  document.getElementById('preview-date').textContent = formatDate(placedAt);
  document.getElementById('preview-time').textContent = formatTime(placedAt);
  
  // Update bet type
  const betType = document.getElementById('betTypeSelect').value;
  document.getElementById('preview-bet-type').textContent = betType.charAt(0).toUpperCase() + betType.slice(1);
  
  // Update stake and currency
  const stake = parseFloat(document.getElementById('stakeInput').value) || 0;
  const currency = document.getElementById('currencySelect').value;
  document.getElementById('preview-stake').textContent = formatCurrency(stake, currency);
  
  // Get all selections
  const selectionRows = document.querySelectorAll('.selection-row');
  const selections = [];
  
  selectionRows.forEach(row => {
    const homeTeam = row.querySelector('.home-team').value;
    const awayTeam = row.querySelector('.away-team').value;
    const market = row.querySelector('.market').value;
    const selection = row.querySelector('.selection').value;
    const odds = parseFloat(row.querySelector('.odds').value) || 1;
    const eventDate = new Date(row.querySelector('.event-date').value);
    
    selections.push({
      homeTeam, 
      awayTeam, 
      market, 
      selection, 
      odds, 
      eventDate
    });
  });
  
  // Update selections in preview
  const selectionsContainer = document.getElementById('preview-selections');
  selectionsContainer.innerHTML = '';
  
  selections.forEach(selection => {
    const matchItem = document.createElement('div');
    matchItem.className = 'match-item mb-3 pb-2';
    
    matchItem.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs text-gray-500">
          ${formatDate(selection.eventDate)} ${formatTime(selection.eventDate)}
        </span>
        <span class="font-semibold">${selection.odds.toFixed(2)}</span>
      </div>
      
      <div class="font-medium mb-1">
        ${selection.homeTeam} v ${selection.awayTeam}
      </div>
      
      <div class="flex justify-between text-xs">
        <span class="text-gray-600">${selection.market}</span>
        <span class="font-semibold text-bet365-green">${selection.selection}</span>
      </div>
    `;
    
    selectionsContainer.appendChild(matchItem);
  });
  
  // Calculate total odds and returns
  const totalOdds = calculateTotalOdds(selections);
  const totalReturns = calculateReturns(stake, totalOdds);
  
  // Show/hide total odds based on number of selections
  const oddsContainer = document.getElementById('preview-odds-container');
  if (selections.length > 1) {
    oddsContainer.classList.remove('hidden');
    document.getElementById('preview-odds').textContent = totalOdds.toFixed(2);
  } else {
    oddsContainer.classList.add('hidden');
  }
  
  // Update returns
  document.getElementById('preview-returns').textContent = formatCurrency(totalReturns, currency);
}

function calculateTotalOdds(selections) {
  if (selections.length === 0) return 0;
  
  return selections.reduce((total, selection) => {
    return total * selection.odds;
  }, 1);
}

function calculateReturns(stake, odds) {
  return parseFloat((stake * odds).toFixed(2));
}

function formatCurrency(amount, currency) {
  const currencySymbols = {
    "GBP": "£",
    "USD": "$",
    "EUR": "€"
  };
  
  const symbol = currencySymbols[currency] || "£";
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateForInput(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function generateReceiptNumber() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function downloadBetslip() {
  showToast('Preparing download...');
  
  setTimeout(() => {
    const betslipElement = document.getElementById('betslip-preview');
    
    html2canvas(betslipElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const dataURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      const bookmakerName = document.getElementById('bookmakerName').value.replace(/\s+/g, '-').toLowerCase();
      const receiptNumber = document.getElementById('receiptInput').value;
      
      downloadLink.href = dataURL;
      downloadLink.download = `${bookmakerName}-${receiptNumber}.png`;
      downloadLink.click();
      
      showToast('Betslip downloaded successfully!');
    }).catch(error => {
      console.error('Error generating image:', error);
      showToast('Failed to download betslip', true);
    });
  }, 100);
}

function toggleShareButtons() {
  const shareButtonsContainer = document.getElementById('shareButtonsContainer');
  shareButtonsContainer.classList.toggle('hidden');
}

function shareOnSocialMedia(platform) {
  const betslipElement = document.getElementById('betslip-preview');
  
  html2canvas(betslipElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true
  }).then(canvas => {
    const dataURL = canvas.toDataURL('image/png');
    const text = 'Check out my betting slip!';
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    showToast(`Sharing via ${platform}...`);
  }).catch(error => {
    console.error('Error generating image for sharing:', error);
    showToast('Failed to share betslip', true);
  });
}

function showToast(message, isError = false) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById('toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 16px';
    toast.style.borderRadius = '4px';
    toast.style.fontWeight = '500';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '1000';
    toast.style.transition = 'all 0.3s ease';
    toast.style.transform = 'translateY(100px)';
    document.body.appendChild(toast);
  }
  
  // Set toast style based on type
  if (isError) {
    toast.style.backgroundColor = '#ef4444';
    toast.style.color = '#ffffff';
  } else {
    toast.style.backgroundColor = '#00703c';
    toast.style.color = '#ffffff';
  }
  
  // Set message and show toast
  toast.textContent = message;
  toast.style.transform = 'translateY(0)';
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
  }, 3000);
}
