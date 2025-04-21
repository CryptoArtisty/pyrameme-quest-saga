
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cell, Treasure, PlayerPosition } from '@/types/game';

type SharedGameState = {
  id: string;
  maze: Cell[];
  treasures: Treasure[];
  exitCell: { col: number; row: number };
  phase: "claim" | "play";
  startTime: string;
  timerDuration: number;
  updatedAt: string;
};

export const useActiveGame = () => {
  const [sharedGame, setSharedGame] = useState<SharedGameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the current active game
  const fetchActiveGame = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setSharedGame({
        id: data.id,
        maze: data.maze,
        treasures: data.treasures,
        exitCell: data.exit_cell,
        phase: data.phase,
        startTime: data.start_time,
        timerDuration: data.timer_duration,
        updatedAt: data.updated_at,
      });
    }
    setIsLoading(false);
    if (error) console.error(error.message);
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchActiveGame();

    // Subscribe to changes on games table
    const channel = supabase
      .channel('public:games')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: 'is_active=eq.true',
      }, payload => {
        // Update state when the shared game changes
        if (payload.new) {
          setSharedGame({
            id: payload.new.id,
            maze: payload.new.maze,
            treasures: payload.new.treasures,
            exitCell: payload.new.exit_cell,
            phase: payload.new.phase,
            startTime: payload.new.start_time,
            timerDuration: payload.new.timer_duration,
            updatedAt: payload.new.updated_at,
          });
        } else {
          fetchActiveGame();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchActiveGame]);

  return {
    sharedGame,
    isLoading,
    refresh: fetchActiveGame,
  };
};
