'use client';

import { useState } from 'react';
import { Config } from '@/app/page';
import { X, Settings } from 'lucide-react';

interface ConfigModalProps {
  config: Config;
  onSave: (config: Config) => void;
  onClose: () => void;
}

export default function ConfigModal({ config, onSave, onClose }: ConfigModalProps) {
  const [aiModel, setAiModel] = useState(config.aiModel);
  const [qwenApiKey, setQwenApiKey] = useState(config.qwenApiKey);

  const handleSave = () => {
    onSave({ aiModel, qwenApiKey });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-surface rounded-xl border border-dark-border w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-accent-primary" />
            <h2 className="text-xl font-bold">Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-elevated rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              AI Model for Script Generation
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
            <p className="text-xs text-dark-muted mt-2">
              Select the AI model to use for generating scripts and prompts
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Qwen API Key
            </label>
            <input
              type="password"
              value={qwenApiKey}
              onChange={(e) => setQwenApiKey(e.target.value)}
              placeholder="Enter your Qwen API key"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary"
            />
            <p className="text-xs text-dark-muted mt-2">
              Required for video generation. Your API key is stored locally and never shared.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-dark-border">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-semibold transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
