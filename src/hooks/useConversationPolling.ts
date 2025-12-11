import { useState, useEffect, useCallback, useRef } from 'react';
import type { QAEntry } from '../types/conversation';
import { fetchConversation } from '../services/api';

interface UseConversationPollingOptions {
  pollingInterval?: number;
  enabled?: boolean;
}

interface UseConversationPollingResult {
  entries: QAEntry[];
  isLoading: boolean;
  error: string | null;
  hasNewEntry: boolean;
  startPolling: () => void;
  stopPolling: () => void;
}

export function useConversationPolling(
  options: UseConversationPollingOptions = {}
): UseConversationPollingResult {
  const { pollingInterval = 1000, enabled = true } = options;

  const [entries, setEntries] = useState<QAEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(enabled);
  const [hasNewEntry, setHasNewEntry] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const prevEntriesLengthRef = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchConversation();

      // Check if there are new entries
      if (response.length > prevEntriesLengthRef.current) {
        setHasNewEntry(true);
        // Reset after animation duration
        setTimeout(() => setHasNewEntry(false), 500);
      }

      prevEntriesLengthRef.current = response.length;
      setEntries(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPolling) return;

    fetchData();

    intervalRef.current = window.setInterval(fetchData, pollingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPolling, pollingInterval, fetchData]);

  return {
    entries,
    isLoading,
    error,
    hasNewEntry,
    startPolling,
    stopPolling,
  };
}
