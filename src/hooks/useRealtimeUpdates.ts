
import { useState, useEffect } from 'react';
import { setupRealtimeTracking } from '@/utils/realtimeTracking';

/**
 * Hook to subscribe to realtime updates for a specific table
 * @param tableName The name of the table to track
 * @param event The event type (INSERT, UPDATE, DELETE, *)
 * @param initialData Initial data state
 * @param dataTransform Optional function to transform incoming data
 * @returns The current data state and a function to update it
 */
export function useRealtimeUpdates<T>(
  tableName: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  initialData: T[],
  dataTransform?: (payload: any) => T
) {
  const [data, setData] = useState<T[]>(initialData);

  useEffect(() => {
    // Set initial data when it changes from outside
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    // Set up realtime tracking for the table
    const cleanup = setupRealtimeTracking(tableName, event, (payload) => {
      console.log(`Realtime update for ${tableName}:`, payload);

      // Handle the payload based on the event type
      if (payload.eventType === 'INSERT') {
        const newItem = dataTransform ? dataTransform(payload.new) : payload.new;
        setData((current) => [...current, newItem]);
      } 
      else if (payload.eventType === 'UPDATE') {
        const updatedItem = dataTransform ? dataTransform(payload.new) : payload.new;
        setData((current) => 
          current.map((item: any) => 
            item.id === payload.new.id ? updatedItem : item
          )
        );
      }
      else if (payload.eventType === 'DELETE') {
        setData((current) => 
          current.filter((item: any) => item.id !== payload.old.id)
        );
      }
    });

    return cleanup;
  }, [tableName, event, dataTransform]);

  return {
    data,
    setData
  };
}

/**
 * Hook to subscribe to realtime updates for a specific record
 * @param tableName The name of the table to track
 * @param columnName The column name to filter on
 * @param value The value to filter by
 * @param event The event type (INSERT, UPDATE, DELETE, *)
 * @param initialData Initial data state
 * @returns The current data state and a function to update it
 */
export function useRealtimeRecord<T>(
  tableName: string,
  columnName: string,
  value: string | number,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  initialData: T | null
) {
  const [data, setData] = useState<T | null>(initialData);

  useEffect(() => {
    // Update data when initialData changes
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    // Import dynamically to avoid circular dependencies
    import('@/utils/realtimeTracking').then(({ trackRecord }) => {
      // Set up realtime tracking for the specific record
      const cleanup = trackRecord(tableName, columnName, value, event, (payload) => {
        console.log(`Realtime update for ${tableName}:${columnName}=${value}:`, payload);

        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setData(payload.new as T);
        } 
        else if (payload.eventType === 'DELETE') {
          setData(null);
        }
      });

      return cleanup;
    });
  }, [tableName, columnName, value, event]);

  return {
    data,
    setData
  };
}
