
import React, { useState, useEffect } from 'react';
import BetslipForm from '@/components/BetslipForm';
import BetslipPreview from '@/components/BetslipPreview';
import { createBlankBetslip, BetslipData } from '@/utils/betslipGenerator';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [betslip, setBetslip] = useState<BetslipData>(createBlankBetslip());
  
  // Load HTML2Canvas dynamically when needed (for image generation)
  useEffect(() => {
    const preloadHtml2Canvas = async () => {
      try {
        await import('html2canvas');
      } catch (error) {
        console.error('Failed to preload html2canvas:', error);
      }
    };
    
    preloadHtml2Canvas();
  }, []);

  const handleBetslipChange = (updatedBetslip: BetslipData) => {
    setBetslip(updatedBetslip);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <header className={`py-4 px-6 shadow-md ${betslip.bookmaker === 'bet365' ? 'bg-bet365-green' : 'bg-[#111111]'}`}>
        <div className="container mx-auto">
          <h1 className="text-white text-2xl font-bold">Betslip Generator</h1>
          <p className="text-white text-opacity-80 text-sm">Create realistic looking betting slips</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass-effect rounded-xl p-6 mb-6 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Create Your Fake Betslip</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Customize every detail of your betting slip to share with friends. Switch between bookmakers to create different styled betslips. This is for entertainment purposes only.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BetslipForm betslip={betslip} onBetslipChange={handleBetslipChange} />
            <BetslipPreview betslip={betslip} />
          </div>
          
          <Separator className="my-10" />
          
          <div className="text-center text-gray-500 text-sm animate-fade-in">
            <p className="mb-2">This tool is for entertainment purposes only. Not affiliated with bet365 or DraftKings.</p>
            <p>Created with ❤️ using React, Tailwind CSS and shadcn/ui.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
