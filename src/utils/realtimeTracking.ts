
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets up realtime tracking for the specified table
 * @param tableName The name of the table to track
 * @param event The event type (INSERT, UPDATE, DELETE)
 * @param callback The function to call when an event occurs
 * @returns A cleanup function to remove the channel
 */
export const setupRealtimeTracking = (
  tableName: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*', 
  callback: (payload: any) => void
) => {
  // Create a unique channel name
  const channelName = `realtime-${tableName}-${event}-${Date.now()}`;
  
  // Set up the realtime subscription
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: event === '*' ? undefined : event,
        schema: 'public',
        table: tableName
      } as any,
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
    
  // Return a cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Sets up realtime tracking for a specific record in a table
 * @param tableName The name of the table to track
 * @param columnName The column name to filter on
 * @param value The value to filter by
 * @param event The event type (INSERT, UPDATE, DELETE)
 * @param callback The function to call when an event occurs
 * @returns A cleanup function to remove the channel
 */
export const trackRecord = (
  tableName: string,
  columnName: string,
  value: string | number,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) => {
  // Create a unique channel name
  const channelName = `realtime-${tableName}-${columnName}-${value}-${event}-${Date.now()}`;
  
  // Set up the realtime subscription with filter
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: event === '*' ? undefined : event,
        schema: 'public',
        table: tableName,
        filter: `${columnName}=eq.${value}`
      } as any,
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
    
  // Return a cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Sets up realtime presence tracking
 * @param roomName The name of the room to track presence in
 * @param userData The data to associate with this user
 * @returns An object with functions to update presence and a cleanup function
 */
export const setupPresenceTracking = (roomName: string, userData: any) => {
  // Create a channel for presence
  const channel = supabase.channel(roomName);
  
  // Set up presence tracking
  channel.on('presence', { event: 'sync' }, () => {
    // Get current state of the presence tracker
    const presenceState = channel.presenceState();
    console.log('Current presence state:', presenceState);
  });
  
  channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', key, newPresences);
  });
  
  channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', key, leftPresences);
  });
  
  // Subscribe to the channel
  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      // Once subscribed, start tracking presence
      channel.track(userData);
    }
  });
  
  // Return functions to update presence and clean up
  return {
    updatePresence: (newData: any) => {
      channel.track({ ...userData, ...newData });
    },
    cleanup: () => {
      supabase.removeChannel(channel);
    }
  };
};
