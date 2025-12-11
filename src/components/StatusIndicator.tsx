interface StatusIndicatorProps {
  isLoading: boolean;
  error: string | null;
  entryCount: number;
}

export function StatusIndicator({ error }: StatusIndicatorProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        <span className="text-xs font-semibold text-red-600">Disconnected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#4CE6B1]/10 rounded-full border border-[#4CE6B1]/30">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CE6B1] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4CE6B1]"></span>
      </span>
      <span className="text-xs font-semibold text-[#0E1A2B]">Live</span>
    </div>
  );
}
