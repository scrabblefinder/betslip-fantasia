
import React, { useState, useEffect } from 'react';
import BetslipForm from '@/components/BetslipForm';
import BetslipPreview from '@/components/BetslipPreview';
import { createBlankBetslip, BetslipData } from '@/utils/betslipGenerator';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  CreditCard, 
  Share2, 
  Download, 
  Plus, 
  CalendarClock, 
  Dice1 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
      <header className="py-4 px-6 shadow-md bg-bet365-green">
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
              Customize every detail of your betting slip to share with friends. This is for entertainment purposes only.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BetslipForm betslip={betslip} onBetslipChange={handleBetslipChange} />
            <BetslipPreview betslip={betslip} />
          </div>
          
          <Separator className="my-10" />
          
          {/* How To Section */}
          <div className="mb-10 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">How To Use This Tool</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden border-t-4 border-t-bet365-green hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-soft-green p-3 rounded-full">
                      <Edit className="h-6 w-6 text-bet365-green" />
                    </div>
                    <h3 className="font-semibold text-lg">1. Create Your Betslip</h3>
                  </div>
                  <p className="text-gray-600">
                    Enter your teams, markets, and selections. Add multiple selections for accumulators, or keep it simple with a single bet.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <Plus className="h-4 w-4" />
                    <span>Add as many selections as you want</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-t-4 border-t-bet365-green hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-soft-green p-3 rounded-full">
                      <CreditCard className="h-6 w-6 text-bet365-green" />
                    </div>
                    <h3 className="font-semibold text-lg">2. Set Stake & Details</h3>
                  </div>
                  <p className="text-gray-600">
                    Choose your stake amount, currency, and bet type. Customize the receipt number and placement time.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarClock className="h-4 w-4" />
                    <span>Set custom date and time</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-t-4 border-t-bet365-green hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-soft-green p-3 rounded-full">
                      <Share2 className="h-6 w-6 text-bet365-green" />
                    </div>
                    <h3 className="font-semibold text-lg">3. Share or Download</h3>
                  </div>
                  <p className="text-gray-600">
                    Download your betslip as an image or share it directly to social media platforms like Facebook, Twitter, or WhatsApp.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <Download className="h-4 w-4" />
                    <span>Save as image for later use</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <Dice1 className="h-5 w-5 text-bet365-green" />
                <h3 className="font-semibold">Important Note</h3>
              </div>
              <p className="text-gray-600">
                This tool is for entertainment purposes only. The generated betslips are not real betting receipts and cannot be redeemed at any bookmaker. 
                Share responsibly and remember that gambling should be fun and done in moderation.
              </p>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm animate-fade-in">
            <p className="mb-2">This tool is for entertainment purposes only. Not affiliated with bet365.</p>
            <p>Created with ❤️ using React, Tailwind CSS and shadcn/ui.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
