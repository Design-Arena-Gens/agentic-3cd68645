'use client';

import { useState, useEffect } from 'react';
import { Idea, ScriptVersion, Config } from '@/app/page';
import { FileText, Clock, User, Sparkles, Save, History } from 'lucide-react';
import { format } from 'date-fns';

interface ScriptCreationProps {
  selectedIdea: Idea | null;
  config: Config;
  onComplete: (versions: ScriptVersion[]) => void;
  initialVersions: ScriptVersion[];
}

export default function ScriptCreation({
  selectedIdea,
  config,
  onComplete,
  initialVersions,
}: ScriptCreationProps) {
  const [scriptContent, setScriptContent] = useState('');
  const [versions, setVersions] = useState<ScriptVersion[]>(initialVersions);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [collaborators] = useState(['You', 'AI Assistant', 'Team Member']);

  useEffect(() => {
    if (initialVersions.length > 0 && !scriptContent) {
      setScriptContent(initialVersions[initialVersions.length - 1].content);
      setSelectedVersion(initialVersions[initialVersions.length - 1].id);
    }
  }, [initialVersions, scriptContent]);

  const generateScript = async () => {
    if (!selectedIdea) return;

    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedScript = `# ${selectedIdea.title}

## Opening Hook (0:00-0:15)
[Dramatic music fades in]
"Imagine a world where artificial intelligence can predict the weather months in advance with near-perfect accuracy..."

## Introduction (0:15-0:45)
Scientists have just achieved something remarkable. A breakthrough in AI technology is revolutionizing how we understand and predict climate patterns.

## Main Content (0:45-2:30)

### The Problem
For decades, climate modeling has been incredibly complex. Traditional methods struggled with accuracy beyond a few weeks.

### The Solution
Researchers developed a new AI system that analyzes millions of data points from satellites, weather stations, and ocean sensors simultaneously.

### The Results
- 95% accuracy in predictions
- Can forecast up to 6 months ahead
- Processes data 1000x faster than previous systems

## Real-World Impact (2:30-3:15)
This technology could help farmers plan crops, cities prepare for extreme weather, and governments develop better climate policies.

## Expert Perspective (3:15-3:45)
Leading climate scientists are calling this a game-changer that will save lives and resources.

## Conclusion (3:45-4:00)
The future of weather forecasting is here, and it's powered by AI.

[Call to action: Subscribe for more tech breakthroughs]`;

    const newVersion: ScriptVersion = {
      id: `version-${Date.now()}`,
      content: generatedScript,
      timestamp: new Date(),
      author: 'AI Assistant',
    };

    setVersions([...versions, newVersion]);
    setScriptContent(generatedScript);
    setSelectedVersion(newVersion.id);
    setGenerating(false);
  };

  const saveVersion = () => {
    const newVersion: ScriptVersion = {
      id: `version-${Date.now()}`,
      content: scriptContent,
      timestamp: new Date(),
      author: 'You',
    };

    const updatedVersions = [...versions, newVersion];
    setVersions(updatedVersions);
    setSelectedVersion(newVersion.id);
  };

  const loadVersion = (version: ScriptVersion) => {
    setScriptContent(version.content);
    setSelectedVersion(version.id);
  };

  const handleComplete = () => {
    if (versions.length === 0 && scriptContent) {
      saveVersion();
    }
    onComplete(versions.length > 0 ? versions : [
      {
        id: 'version-1',
        content: scriptContent,
        timestamp: new Date(),
        author: 'You',
      },
    ]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-accent-primary" />
          <h2 className="text-2xl font-bold">Script Creation</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateScript}
            disabled={generating || !selectedIdea}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Generating...' : 'Generate Script'}
          </button>
          <button
            onClick={saveVersion}
            disabled={!scriptContent}
            className="flex items-center gap-2 px-4 py-2 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Version
          </button>
        </div>
      </div>

      {selectedIdea && (
        <div className="bg-dark-surface rounded-xl p-4 mb-6 border border-dark-border">
          <h3 className="font-semibold mb-1">Selected Idea:</h3>
          <p className="text-dark-muted text-sm">{selectedIdea.title}</p>
        </div>
      )}

      <div className="bg-dark-surface rounded-xl p-4 mb-4 border border-dark-border">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-dark-muted" />
          <span className="text-sm text-dark-muted">Active Collaborators:</span>
        </div>
        <div className="flex gap-2">
          {collaborators.map((collab, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-dark-elevated rounded-full text-xs font-semibold"
            >
              {collab}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
            <div className="border-b border-dark-border px-4 py-2 bg-dark-elevated">
              <span className="text-sm font-semibold">Script Editor</span>
              <span className="text-xs text-dark-muted ml-2">
                (Model: {config.aiModel})
              </span>
            </div>
            <textarea
              value={scriptContent}
              onChange={(e) => setScriptContent(e.target.value)}
              placeholder="Start writing your script or click 'Generate Script' to use AI..."
              className="w-full h-[600px] bg-dark-bg text-dark-text p-6 resize-none focus:outline-none font-mono text-sm"
              style={{ lineHeight: '1.8' }}
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleComplete}
              disabled={!scriptContent}
              className="px-6 py-3 bg-accent-success hover:bg-accent-success/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete & Continue to B-roll
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden sticky top-24">
            <div className="border-b border-dark-border px-4 py-3 bg-dark-elevated flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="text-sm font-semibold">Version History</span>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {versions.length === 0 ? (
                <div className="p-4 text-center text-dark-muted text-sm">
                  No saved versions yet
                </div>
              ) : (
                <div className="p-2">
                  {versions
                    .slice()
                    .reverse()
                    .map((version) => (
                      <button
                        key={version.id}
                        onClick={() => loadVersion(version)}
                        className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                          selectedVersion === version.id
                            ? 'bg-accent-primary/20 border border-accent-primary'
                            : 'bg-dark-elevated hover:bg-dark-border'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3 h-3 text-dark-muted" />
                          <span className="text-xs text-dark-muted">
                            {format(version.timestamp, 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <div className="text-sm font-semibold mb-1">
                          {version.author}
                        </div>
                        <div className="text-xs text-dark-muted line-clamp-2">
                          {version.content.substring(0, 60)}...
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
