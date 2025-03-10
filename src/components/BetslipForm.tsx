import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash, Plus, RefreshCw } from "lucide-react";
import { BetslipData, BetSelection, Bookmaker, addSelection, removeSelection, createBlankBetslip } from "@/utils/betslipGenerator";

interface BetslipFormProps {
  betslip: BetslipData;
  onBetslipChange: (betslip: BetslipData) => void;
}

const BetslipForm: React.FC<BetslipFormProps> = ({ betslip, onBetslipChange }) => {
  const [activeTab, setActiveTab] = useState<string>("matches");

  const handleResetForm = () => {
    onBetslipChange(createBlankBetslip());
  };

  const handleAddSelection = () => {
    onBetslipChange(addSelection(betslip));
  };

  const handleRemoveSelection = (id: string) => {
    if (betslip.selections.length <= 1) return;
    onBetslipChange(removeSelection(betslip, id));
  };

  const handleSelectionChange = (id: string, field: keyof BetSelection, value: string | number | Date) => {
    const updatedSelections = betslip.selections.map(selection => {
      if (selection.id === id) {
        return { ...selection, [field]: value };
      }
      return selection;
    });
    
    onBetslipChange({
      ...betslip,
      selections: updatedSelections
    });
  };

  const handleStakeChange = (stake: string) => {
    onBetslipChange({
      ...betslip,
      stake: parseFloat(stake) || 0
    });
  };

  const handleBetTypeChange = (betType: string) => {
    onBetslipChange({
      ...betslip,
      betType
    });
  };

  const handleDateChange = (id: string, dateString: string) => {
    const date = new Date(dateString);
    handleSelectionChange(id, 'eventDate', date);
  };

  const handleBookmakerChange = (bookmaker: Bookmaker) => {
    onBetslipChange({
      ...betslip,
      bookmaker,
      currency: 'GBP',
      // Clear the custom name if switching back to bet365
      customBookmakerName: bookmaker === 'bet365' ? undefined : betslip.customBookmakerName
    });
  };

  const handleCustomBookmakerNameChange = (name: string) => {
    onBetslipChange({
      ...betslip,
      customBookmakerName: name
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Betslip</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetForm}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>

        <div className="mb-4">
          <Label htmlFor="custom-bookmaker" className="text-sm font-medium">Bookmaker Name</Label>
          <Input
            id="custom-bookmaker"
            value={betslip.customBookmakerName}
            onChange={(e) => handleCustomBookmakerNameChange(e.target.value)}
            placeholder="Enter bookmaker name"
            className="mt-1"
          />
        </div>

        <Tabs defaultValue="matches" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <div className="space-y-4">
              {betslip.selections.map((selection, index) => (
                <div key={selection.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 animate-slide-in">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Selection {index + 1}</h3>
                    {betslip.selections.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSelection(selection.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`home-${selection.id}`} className="text-xs">Home Team</Label>
                        <Input
                          id={`home-${selection.id}`}
                          value={selection.homeTeam}
                          onChange={(e) => handleSelectionChange(selection.id, 'homeTeam', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`away-${selection.id}`} className="text-xs">Away Team</Label>
                        <Input
                          id={`away-${selection.id}`}
                          value={selection.awayTeam}
                          onChange={(e) => handleSelectionChange(selection.id, 'awayTeam', e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`market-${selection.id}`} className="text-xs">Market</Label>
                      <Select 
                        value={selection.market} 
                        onValueChange={(value) => handleSelectionChange(selection.id, 'market', value)}
                      >
                        <SelectTrigger id={`market-${selection.id}`} className="h-9">
                          <SelectValue placeholder="Select Market" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Match Result">Match Result</SelectItem>
                          <SelectItem value="Both Teams to Score">Both Teams to Score</SelectItem>
                          <SelectItem value="Over/Under 2.5 Goals">Over/Under 2.5 Goals</SelectItem>
                          <SelectItem value="Correct Score">Correct Score</SelectItem>
                          <SelectItem value="First Goalscorer">First Goalscorer</SelectItem>
                          <SelectItem value="Custom">Custom Market</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selection.market === "Custom" && (
                      <div>
                        <Label htmlFor={`custom-market-${selection.id}`} className="text-xs">Custom Market Text</Label>
                        <Input
                          id={`custom-market-${selection.id}`}
                          value={selection.customMarket || ''}
                          onChange={(e) => handleSelectionChange(selection.id, 'customMarket', e.target.value)}
                          placeholder="Enter your custom market text"
                          className="h-9"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`selection-${selection.id}`} className="text-xs">Selection</Label>
                        <Input
                          id={`selection-${selection.id}`}
                          value={selection.selection}
                          onChange={(e) => handleSelectionChange(selection.id, 'selection', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`odds-${selection.id}`} className="text-xs">Odds</Label>
                        <Input
                          id={`odds-${selection.id}`}
                          type="number"
                          step="0.01"
                          min="1.01"
                          value={selection.odds}
                          onChange={(e) => handleSelectionChange(selection.id, 'odds', parseFloat(e.target.value) || 1.01)}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`date-${selection.id}`} className="text-xs">Event Date & Time</Label>
                      <Input
                        id={`date-${selection.id}`}
                        type="datetime-local"
                        value={selection.eventDate instanceof Date ? selection.eventDate.toISOString().slice(0, 16) : ''}
                        onChange={(e) => handleDateChange(selection.id, e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={handleAddSelection} 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Selection</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="stake">
            <div className="space-y-4">
              <div>
                <Label htmlFor="stake" className="text-sm font-medium">Stake Amount (£)</Label>
                <Input
                  id="stake"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={betslip.stake}
                  onChange={(e) => handleStakeChange(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="bet-type" className="text-sm font-medium">Bet Type</Label>
                <Select value={betslip.betType} onValueChange={handleBetTypeChange}>
                  <SelectTrigger id="bet-type">
                    <SelectValue placeholder="Select Bet Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="treble">Treble</SelectItem>
                    <SelectItem value="accumulator">Accumulator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <Label htmlFor="receipt" className="text-sm font-medium">Receipt Number</Label>
                <Input
                  id="receipt"
                  value={betslip.receiptNumber}
                  onChange={(e) => onBetslipChange({...betslip, receiptNumber: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="date-placed" className="text-sm font-medium">Date Placed</Label>
                <Input
                  id="date-placed"
                  type="datetime-local"
                  value={betslip.placedAt instanceof Date ? betslip.placedAt.toISOString().slice(0, 16) : ''}
                  onChange={(e) => onBetslipChange({...betslip, placedAt: new Date(e.target.value)})}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4 gap-2">
          <Button 
            variant="outline"
            onClick={() => setActiveTab(activeTab === "matches" ? "stake" : activeTab === "stake" ? "details" : "matches")}
          >
            {activeTab === "matches" ? "Next: Stake" : activeTab === "stake" ? "Next: Details" : "Back to Matches"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BetslipForm;
