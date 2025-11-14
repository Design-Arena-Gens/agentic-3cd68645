'use client';

import { useState, useEffect, useRef } from 'react';
import { BrollPrompt, VideoClip, Config } from '@/app/page';
import { Video, Play, Pause, Scissors, RotateCw, Loader2, Download } from 'lucide-react';

interface VideoGenerationProps {
  brollPrompts: BrollPrompt[];
  config: Config;
  onComplete: (clips: VideoClip[]) => void;
  initialClips: VideoClip[];
}

export default function VideoGeneration({
  brollPrompts,
  config,
  onComplete,
  initialClips,
}: VideoGenerationProps) {
  const [clips, setClips] = useState<VideoClip[]>(initialClips);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [playingClip, setPlayingClip] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (initialClips.length === 0 && brollPrompts.length > 0) {
      generateAllClips();
    }
  }, []);

  const generateAllClips = async () => {
    setGenerating(true);

    for (let i = 0; i < brollPrompts.length; i++) {
      const prompt = brollPrompts[i];

      await new Promise((resolve) => setTimeout(resolve, 800));

      const newClip: VideoClip = {
        id: `clip-${i}`,
        scriptLineId: prompt.id,
        url: `https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-forest-50543-large.mp4`,
        duration: 5 + Math.random() * 5,
        status: 'ready',
      };

      setClips((prev) => [...prev, newClip]);
    }

    setGenerating(false);
  };

  const regenerateClip = async (clipId: string) => {
    setClips((prev) =>
      prev.map((c) =>
        c.id === clipId ? { ...c, status: 'generating' as const } : c
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setClips((prev) =>
      prev.map((c) =>
        c.id === clipId
          ? {
              ...c,
              status: 'ready' as const,
              url: `https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-forest-50543-large.mp4?v=${Date.now()}`,
            }
          : c
      )
    );
  };

  const togglePlay = (clipId: string) => {
    if (playingClip === clipId) {
      setPlayingClip(null);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      setPlayingClip(clipId);
      setSelectedClip(clipId);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  const handleComplete = () => {
    onComplete(clips);
  };

  const getPromptForClip = (scriptLineId: string) => {
    const prompt = brollPrompts.find((p) => p.id === scriptLineId);
    return prompt?.editedPrompt || prompt?.generatedPrompt || '';
  };

  const getScriptLineForClip = (scriptLineId: string) => {
    const prompt = brollPrompts.find((p) => p.id === scriptLineId);
    return prompt?.scriptLine || '';
  };

  const selectedClipData = clips.find((c) => c.id === selectedClip);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Video className="w-6 h-6 text-accent-primary" />
          <h2 className="text-2xl font-bold">Video Generation</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateAllClips}
            disabled={generating || clips.length > 0}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Video className="w-4 h-4" />
            {generating ? 'Generating...' : 'Generate All Clips'}
          </button>
        </div>
      </div>

      {config.qwenApiKey ? (
        <div className="bg-dark-surface rounded-xl p-4 mb-6 border border-accent-success">
          <p className="text-sm text-accent-success">
            ✓ Qwen API connected and ready
          </p>
        </div>
      ) : (
        <div className="bg-dark-surface rounded-xl p-4 mb-6 border border-accent-warning">
          <p className="text-sm text-accent-warning">
            ⚠ Qwen API key not configured. Please add it in settings.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
            <div className="border-b border-dark-border px-4 py-3 bg-dark-elevated">
              <span className="text-sm font-semibold">Video Timeline</span>
              <span className="text-xs text-dark-muted ml-2">
                ({clips.filter((c) => c.status === 'ready').length} / {brollPrompts.length} clips ready)
              </span>
            </div>

            <div className="p-4 max-h-[700px] overflow-y-auto">
              {generating && clips.length < brollPrompts.length && (
                <div className="flex items-center gap-3 mb-4 p-4 bg-dark-elevated rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
                  <span className="text-sm">
                    Generating clips... ({clips.length} / {brollPrompts.length})
                  </span>
                </div>
              )}

              {clips.length === 0 && !generating ? (
                <div className="text-center py-12 text-dark-muted">
                  Click "Generate All Clips" to start creating videos
                </div>
              ) : (
                <div className="space-y-3">
                  {clips.map((clip, index) => (
                    <div
                      key={clip.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedClip === clip.id
                          ? 'bg-accent-primary/10 border-accent-primary'
                          : 'bg-dark-elevated border-dark-border hover:border-dark-border/60'
                      }`}
                      onClick={() => setSelectedClip(clip.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-dark-bg rounded-lg flex items-center justify-center font-bold text-accent-primary">
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold mb-1 truncate">
                            {getScriptLineForClip(clip.scriptLineId)}
                          </div>
                          <div className="text-xs text-dark-muted mb-2 line-clamp-1">
                            {getPromptForClip(clip.scriptLineId)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                clip.status === 'ready'
                                  ? 'bg-accent-success/20 text-accent-success'
                                  : clip.status === 'generating'
                                  ? 'bg-accent-warning/20 text-accent-warning'
                                  : 'bg-accent-danger/20 text-accent-danger'
                              }`}
                            >
                              {clip.status === 'ready' && 'Ready'}
                              {clip.status === 'generating' && 'Generating...'}
                              {clip.status === 'failed' && 'Failed'}
                            </span>
                            {clip.status === 'ready' && (
                              <span className="text-xs text-dark-muted">
                                {clip.duration.toFixed(1)}s
                              </span>
                            )}
                          </div>
                        </div>

                        {clip.status === 'ready' && (
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePlay(clip.id);
                              }}
                              className="p-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg transition-colors"
                              title={playingClip === clip.id ? 'Pause' : 'Play'}
                            >
                              {playingClip === clip.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                regenerateClip(clip.id);
                              }}
                              className="p-2 bg-dark-bg hover:bg-dark-border text-dark-text rounded-lg transition-colors"
                              title="Regenerate"
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden sticky top-24">
            <div className="border-b border-dark-border px-4 py-3 bg-dark-elevated">
              <span className="text-sm font-semibold">Preview</span>
            </div>

            {selectedClipData ? (
              <div className="p-4">
                <div className="aspect-video bg-dark-bg rounded-lg overflow-hidden mb-4">
                  {selectedClipData.status === 'ready' ? (
                    <video
                      ref={videoRef}
                      src={selectedClipData.url}
                      className="w-full h-full object-cover"
                      loop
                      onEnded={() => setPlayingClip(null)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-dark-muted mb-1">Script Line</div>
                    <div className="text-sm">
                      {getScriptLineForClip(selectedClipData.scriptLineId)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-dark-muted mb-1">Prompt Used</div>
                    <div className="text-sm text-dark-muted">
                      {getPromptForClip(selectedClipData.scriptLineId)}
                    </div>
                  </div>

                  {selectedClipData.status === 'ready' && (
                    <>
                      <div>
                        <div className="text-xs text-dark-muted mb-1">Duration</div>
                        <div className="text-sm">{selectedClipData.duration.toFixed(2)}s</div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg text-sm font-semibold transition-colors">
                          <Scissors className="w-4 h-4" />
                          Trim
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg text-sm font-semibold transition-colors">
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-dark-muted text-sm">
                Select a clip to preview
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleComplete}
          disabled={clips.filter((c) => c.status === 'ready').length !== brollPrompts.length}
          className="px-6 py-3 bg-accent-success hover:bg-accent-success/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Project
        </button>
      </div>
    </div>
  );
}
