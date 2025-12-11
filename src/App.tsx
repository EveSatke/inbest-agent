import { useEffect, useRef } from 'react';
import { useConversationPolling } from './hooks/useConversationPolling';
import { ConversationDisplay } from './components/ConversationDisplay';
import { StatusIndicator } from './components/StatusIndicator';

function App() {
  const { entries, isLoading, error } = useConversationPolling({
    pollingInterval: 5000,
    enabled: true,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b-2 border-[#F7DB00]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/inbest_logo.png" alt="Inbest Logo" className="h-10 w-auto" />
              <div className="border-l-2 border-[#222222]/10 pl-4">
                <h1 className="text-xl font-bold text-[#222222]">
                  Inbest Agent
                </h1>
                <p className="text-sm text-[#222222]/60 font-medium">
                  Helping People Maximise Their Income
                </p>
              </div>
            </div>
            <StatusIndicator isLoading={isLoading} error={error} entryCount={entries.length} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div
          ref={scrollRef}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#222222]/5 p-6 min-h-[600px] max-h-[calc(100vh-220px)] overflow-y-auto shadow-lg shadow-[#0E1A2B]/5"
        >
          <ConversationDisplay entries={entries} />
        </div>

      </main>
    </div>
  );
}

export default App;
