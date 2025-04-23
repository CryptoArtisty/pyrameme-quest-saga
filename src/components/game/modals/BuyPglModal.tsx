
import React, { useState } from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Button } from '@/components/ui/button';
import { ExternalLink, Anchor, ArrowRightLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GOLD_TO_PGL_RATE } from '@/lib/goldEconomy';

export const BuyPglModal = () => {
  const { activeModal, showModal, buyPgl, convertGoldToPGL, gameState } = useGame();
  const [conversionAmount, setConversionAmount] = useState<number>(1000);
  const [tab, setTab] = useState<string>("pgl");

  const openAlcorExchange = () => {
    window.open('https://alcor.exchange/', '_blank', 'noopener,noreferrer');
  };
  
  const handleConvert = async () => {
    if (conversionAmount > 0) {
      await convertGoldToPGL(conversionAmount);
    }
  };

  return (
    <Dialog open={activeModal === 'buy'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Gold & PGL Management</DialogTitle>
          <DialogDescription className="text-sand">
            Buy gold with WAX or PGL tokens, or convert your gold to PGL
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="pgl" value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3 bg-brown/30">
            <TabsTrigger value="pgl" className="data-[state=active]:bg-gold data-[state=active]:text-dark">Buy with PGL</TabsTrigger>
            <TabsTrigger value="wax" className="data-[state=active]:bg-gold data-[state=active]:text-dark">Buy with WAX</TabsTrigger>
            <TabsTrigger value="convert" className="data-[state=active]:bg-gold data-[state=active]:text-dark">Convert to PGL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pgl" className="py-4 space-y-4">
            <p>Exchange Rate: 1 PGL = 1000 gold</p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => buyPgl(1, 'pgl')}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 1,000 gold (1 PGL)
              </Button>
              <Button 
                onClick={() => buyPgl(5, 'pgl')}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 5,000 gold (5 PGL)
              </Button>
              <Button 
                onClick={() => buyPgl(10, 'pgl')}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 10,000 gold (10 PGL)
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="wax" className="py-4 space-y-4">
            <p>Exchange Rate: 1 WAX = 5000 gold</p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => buyPgl(1, 'wax')}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 5,000 gold (1 WAX)
              </Button>
              <Button 
                onClick={() => buyPgl(5, 'wax')}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 25,000 gold (5 WAX)
              </Button>
              <Button 
                onClick={() => buyPgl(10, 'wax')}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 50,000 gold (10 WAX)
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="convert" className="py-4 space-y-4">
            <p>Exchange Rate: {GOLD_TO_PGL_RATE} gold = 1 PGL</p>
            <p>Current Balance: {gameState.walletBalance} gold</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="goldAmount">Gold Amount to Convert</Label>
                <Input 
                  id="goldAmount" 
                  type="number" 
                  min={GOLD_TO_PGL_RATE}
                  step={GOLD_TO_PGL_RATE}
                  value={conversionAmount}
                  onChange={(e) => setConversionAmount(Number(e.target.value))}
                  className="bg-dark border-gold text-gold"
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm">You'll receive:</p>
                  <p className="text-lg font-bold">{(conversionAmount / GOLD_TO_PGL_RATE).toFixed(3)} PGL</p>
                </div>
                <ArrowRightLeft className="h-6 w-6" />
              </div>
              
              <Button 
                onClick={handleConvert}
                disabled={conversionAmount <= 0 || gameState.walletBalance < conversionAmount}
                className="w-full bg-gold text-dark hover:bg-gold/80"
              >
                Convert to PGL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col space-y-2 mt-4">
          <Button 
            variant="outline"
            onClick={openAlcorExchange}
            className="border-gold text-gold hover:bg-gold/20 flex items-center justify-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Alcor Exchange
          </Button>
          <Button 
            variant="outline"
            className="border-gold text-gold hover:bg-gold/20 flex items-center justify-center"
          >
            <Anchor className="mr-2 h-4 w-4" />
            Connect WAX Testnet Wallet
          </Button>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => showModal(null)}
            className="border-gold text-gold hover:bg-gold/20"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
