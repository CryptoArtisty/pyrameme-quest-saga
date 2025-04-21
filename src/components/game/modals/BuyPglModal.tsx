
import React from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Button } from '@/components/ui/button';
import { ExternalLink, Anchor } from 'lucide-react';
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

export const BuyPglModal = () => {
  const { activeModal, showModal, buyPgl } = useGame();

  const openAlcorExchange = () => {
    window.open('https://alcor.exchange/', '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={activeModal === 'buy'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Buy Gold</DialogTitle>
          <DialogDescription className="text-sand">
            Exchange WAX or PGL tokens for gold coins
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="pgl">
          <TabsList className="grid w-full grid-cols-2 bg-brown/30">
            <TabsTrigger value="pgl" className="data-[state=active]:bg-gold data-[state=active]:text-dark">PGL</TabsTrigger>
            <TabsTrigger value="wax" className="data-[state=active]:bg-gold data-[state=active]:text-dark">WAX</TabsTrigger>
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
