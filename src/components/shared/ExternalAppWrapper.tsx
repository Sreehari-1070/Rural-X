import { useState } from 'react';
import { Loader2, ExternalLink, RefreshCw } from 'lucide-react';

interface ExternalAppWrapperProps {
    src: string;
    title: string;
}

export function ExternalAppWrapper({ src, title }: ExternalAppWrapperProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [loadKey, setLoadKey] = useState(0);

    const handleRefresh = () => {
        setIsLoading(true);
        setLoadKey(prev => prev + 1);
    };

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {/* Header / Controls */}
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-text-secondary truncate max-w-[200px] md:max-w-none">
                        {title} <span className="hidden sm:inline">Live Preview</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="rounded-lg p-1.5 text-text-secondary hover:bg-background hover:text-foreground transition-colors"
                        title="Reload Frame"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <a
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                    >
                        <span className="hidden sm:inline">Open in New Tab</span>
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </div>

            {/* Iframe Container */}
            <div className="relative flex-1 bg-background">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-3 animate-pulse text-sm font-medium text-text-secondary">Connecting to {title}...</p>
                    </div>
                )}

                {/* Fallback for blocked content */}
                <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-6 text-center">
                    <p className="mb-4 text-text-secondary">If the tool doesn't load below, use the button to launch it safely.</p>
                    <a
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white shadow-lg hover:bg-primary-dark transition-all hover:scale-105"
                    >
                        Click here to Launch {title}
                        <ExternalLink className="h-5 w-5" />
                    </a>
                </div>

                <iframe
                    key={loadKey}
                    src={src}
                    title={title}
                    className="h-full w-full border-0 bg-transparent"
                    onLoad={() => setIsLoading(false)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
