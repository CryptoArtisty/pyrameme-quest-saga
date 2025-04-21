
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cell, Treasure } from '@/types/game';

type SharedGameState = {
  id: string;
  maze: Cell[];
  treasures: Treasure[];
  exitCell: { col: number; row: number };
  phase: "claim" | "play";
  startTime: number; // UNIX milliseconds
  timerDuration: number; // seconds
  updatedAt: string;
};

function parseJSON<T>(input: any): T {
  if (!input) return [] as any;
  if (typeof input === 'string') return JSON.parse(input);
  return input;
}

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
      .maybeSingle();

    if (data) {
      setSharedGame({
        id: data.id,
        maze: parseJSON<Cell[]>(data.maze),
        treasures: parseJSON<Treasure[]>(data.treasures),
        exitCell: parseJSON<{ col: number; row: number }>(data.exit_cell),
        phase: data.phase === 'play' ? 'play' : 'claim',
        startTime: typeof data.start_time === 'string'
          ? new Date(data.start_time).getTime()
          : Number(data.start_time),
        timerDuration: Number(data.timer_duration),
        updatedAt: data.updated_at,
      });
    } else {
      setSharedGame(null);
    }
    setIsLoading(false);
    if (error) console.error(error.message);
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchActiveGame();

    const channel = supabase
      .channel('public:games')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: 'is_active=eq.true',
      }, payload => {
        // Make sure the payload has the new data
        if (payload.new && typeof payload.new === 'object') {
          const d = payload.new as Record<string, any>;
          setSharedGame({
            id: d.id,
            maze: parseJSON<Cell[]>(d.maze),
            treasures: parseJSON<Treasure[]>(d.treasures),
            exitCell: parseJSON<{ col: number; row: number }>(d.exit_cell),
            phase: d.phase === 'play' ? 'play' : 'claim',
            startTime: typeof d.start_time === 'string'
              ? new Date(d.start_time).getTime()
              : Number(d.start_time),
            timerDuration: Number(d.timer_duration),
            updatedAt: d.updated_at,
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
