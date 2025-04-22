
import { useEffect } from 'react';
import { useGameState } from '../useGameState';
import { supabase } from '@/integrations/supabase/client';
import { Cell, PlayerPosition, Treasure } from '@/types/game';

export const useGameSync = () => {
  const { 
    setMaze, 
    setTreasures, 
    setExitCell, 
    setGameState,
  } = useGameState();

  useEffect(() => {
    const channel = supabase
      .channel('public:games')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: 'is_active=eq.true',
      }, payload => {
        if (payload.new && typeof payload.new === 'object') {
          const d = payload.new as Record<string, any>;
          
          // Parse game data
          const maze = typeof d.maze === 'string' ? JSON.parse(d.maze) : d.maze;
          const treasures = typeof d.treasures === 'string' ? JSON.parse(d.treasures) : d.treasures;
          const exitCell = typeof d.exit_cell === 'string' ? JSON.parse(d.exit_cell) : d.exit_cell;
          
          // Update state
          setMaze(maze as Cell[]);
          setTreasures(treasures as Treasure[]);
          setExitCell(exitCell as PlayerPosition);
          
          // Update phase and timing information
          setGameState(prev => ({
            ...prev,
            phase: d.phase,
            startTime: typeof d.start_time === 'string'
              ? new Date(d.start_time).getTime()
              : Number(d.start_time),
            timeRemaining: calcTimeRemaining(d)
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setMaze, setTreasures, setExitCell, setGameState]);
};

// Helper function to calculate remaining time
const calcTimeRemaining = (gameData: any) => {
  const now = Date.now();
  const startTime = typeof gameData.start_time === 'string'
    ? new Date(gameData.start_time).getTime()
    : Number(gameData.start_time);
  const elapsed = Math.floor((now - startTime) / 1000);
  return Math.max(0, (gameData.timer_duration || 0) - elapsed);
};
