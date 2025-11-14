'use client';

import { useState } from 'react';
import IdeaGeneration from '@/components/IdeaGeneration';
import ScriptCreation from '@/components/ScriptCreation';
import BrollPrompting from '@/components/BrollPrompting';
import VideoGeneration from '@/components/VideoGeneration';
import ProgressTracker from '@/components/ProgressTracker';
import ConfigModal from '@/components/ConfigModal';
import { Settings } from 'lucide-react';

export type Stage = 'idea' | 'script' | 'broll' | 'video';

export interface Idea {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  audienceInterest: 'high' | 'medium' | 'low';
  approved: boolean | null;
}

export interface ScriptVersion {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
}

export interface BrollPrompt {
  id: string;
  scriptLine: string;
  generatedPrompt: string;
  editedPrompt: string;
}

export interface VideoClip {
  id: string;
  scriptLineId: string;
  url: string;
  duration: number;
  status: 'generating' | 'ready' | 'failed';
}

export interface Config {
  aiModel: string;
  qwenApiKey: string;
}

export default function Home() {
  const [currentStage, setCurrentStage] = useState<Stage>('idea');
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [showConfig, setShowConfig] = useState(false);

  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [scriptVersions, setScriptVersions] = useState<ScriptVersion[]>([]);
  const [brollPrompts, setBrollPrompts] = useState<BrollPrompt[]>([]);
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [config, setConfig] = useState<Config>({
    aiModel: 'gpt-4',
    qwenApiKey: '',
  });

  const markStageComplete = (stage: Stage) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages([...completedStages, stage]);
    }
  };

  const handleIdeaApprove = (idea: Idea) => {
    setSelectedIdea(idea);
    markStageComplete('idea');
    setCurrentStage('script');
  };

  const handleScriptComplete = (versions: ScriptVersion[]) => {
    setScriptVersions(versions);
    markStageComplete('script');
    setCurrentStage('broll');
  };

  const handleBrollComplete = (prompts: BrollPrompt[]) => {
    setBrollPrompts(prompts);
    markStageComplete('broll');
    setCurrentStage('video');
  };

  const handleVideoComplete = (clips: VideoClip[]) => {
    setVideoClips(clips);
    markStageComplete('video');
  };

  return (
    <main className="min-h-screen">
      <header className="bg-dark-surface border-b border-dark-border px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Video Creator</h1>
          <button
            onClick={() => setShowConfig(true)}
            className="p-2 hover:bg-dark-elevated rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <ProgressTracker
          currentStage={currentStage}
          completedStages={completedStages}
          onStageClick={setCurrentStage}
        />

        <div className="mt-8">
          {currentStage === 'idea' && (
            <IdeaGeneration onApprove={handleIdeaApprove} />
          )}

          {currentStage === 'script' && (
            <ScriptCreation
              selectedIdea={selectedIdea}
              config={config}
              onComplete={handleScriptComplete}
              initialVersions={scriptVersions}
            />
          )}

          {currentStage === 'broll' && (
            <BrollPrompting
              scriptVersions={scriptVersions}
              config={config}
              onComplete={handleBrollComplete}
              initialPrompts={brollPrompts}
            />
          )}

          {currentStage === 'video' && (
            <VideoGeneration
              brollPrompts={brollPrompts}
              config={config}
              onComplete={handleVideoComplete}
              initialClips={videoClips}
            />
          )}
        </div>
      </div>

      {showConfig && (
        <ConfigModal
          config={config}
          onSave={setConfig}
          onClose={() => setShowConfig(false)}
        />
      )}
    </main>
  );
}
