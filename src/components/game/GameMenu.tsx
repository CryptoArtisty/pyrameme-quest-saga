
import React from 'react';
import { Menu, LogIn, Trophy } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useGame } from '@/contexts/game/GameContext';

export const GameMenu = () => {
  const { user } = useAuth();
  const { isMenuOpen, toggleMenu, showModal } = useGame();

  return (
    <Sheet open={isMenuOpen} onOpenChange={toggleMenu}>
      <SheetContent className="bg-dark border-l border-gold">
        <SheetHeader>
          <SheetTitle className="text-gold">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {!user && (
            <Button 
              variant="outline" 
              className="w-full border-gold text-gold justify-start"
              asChild
            >
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Login / Sign Up
              </Link>
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full border-gold text-gold justify-start"
            onClick={() => {
              showModal('tutorial');
              toggleMenu();
            }}
          >
            Tutorial
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-gold text-gold justify-start"
            onClick={() => {
              showModal('buy');
              toggleMenu();
            }}
          >
            Buy Pgl
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-gold text-gold justify-start"
            onClick={() => {
              showModal('leaderboard');
              toggleMenu();
            }}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-gold text-gold justify-start"
            onClick={() => {
              showModal('terms');
              toggleMenu();
            }}
          >
            Terms & Conditions
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
