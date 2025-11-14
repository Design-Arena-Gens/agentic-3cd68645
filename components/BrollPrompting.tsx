'use client';

import { useState, useEffect } from 'react';
import { ScriptVersion, BrollPrompt, Config } from '@/app/page';
import { Image, Sparkles, Edit2, Check, X } from 'lucide-react';

interface BrollPromptingProps {
  scriptVersions: ScriptVersion[];
  config: Config;
  onComplete: (prompts: BrollPrompt[]) => void;
  initialPrompts: BrollPrompt[];
}

export default function BrollPrompting({
  scriptVersions,
  config,
  onComplete,
  initialPrompts,
}: BrollPromptingProps) {
  const [prompts, setPrompts] = useState<BrollPrompt[]>(initialPrompts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [generating, setGenerating] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [bulkEditText, setBulkEditText] = useState('');

  useEffect(() => {
    if (initialPrompts.length === 0 && scriptVersions.length > 0) {
      generatePrompts();
    }
  }, []);

  const extractScriptLines = (script: string): string[] => {
    return script
      .split('\n')
      .filter(
        (line) =>
          line.trim() &&
          !line.startsWith('#') &&
          !line.startsWith('##') &&
          !line.startsWith('[') &&
          !line.startsWith('---')
      )
      .slice(0, 20); // Limit to 20 lines for demo
  };

  const generatePromptForLine = (line: string): string => {
    const prompts = [
      `Cinematic shot of ${line.toLowerCase()}. 4K, professional lighting, dramatic composition`,
      `High-quality b-roll footage: ${line.toLowerCase()}. Studio quality, vibrant colors, smooth camera movement`,
      `Professional video clip showing ${line.toLowerCase()}. Commercial grade, dynamic angles, perfect focus`,
      `Atmospheric visual of ${line.toLowerCase()}. Cinematic color grading, shallow depth of field`,
      `Stock footage style: ${line.toLowerCase()}. Clean, modern aesthetic, high production value`,
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const generatePrompts = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const latestScript = scriptVersions[scriptVersions.length - 1];
    const scriptLines = extractScriptLines(latestScript.content);

    const newPrompts: BrollPrompt[] = scriptLines.map((line, index) => ({
      id: `prompt-${index}`,
      scriptLine: line,
      generatedPrompt: generatePromptForLine(line),
      editedPrompt: '',
    }));

    setPrompts(newPrompts);
    setGenerating(false);
  };

  const startEdit = (prompt: BrollPrompt) => {
    setEditingId(prompt.id);
    setEditValue(prompt.editedPrompt || prompt.generatedPrompt);
  };

  const saveEdit = (promptId: string) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === promptId ? { ...p, editedPrompt: editValue } : p
      )
    );
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const applyBulkEdit = () => {
    const suffix = bulkEditText.trim();
    setPrompts((prev) =>
      prev.map((p) => ({
        ...p,
        editedPrompt: `${p.editedPrompt || p.generatedPrompt}. ${suffix}`,
      }))
    );
    setBulkEdit(false);
    setBulkEditText('');
  };

  const handleComplete = () => {
    onComplete(prompts);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6 text-accent-primary" />
          <h2 className="text-2xl font-bold">B-roll Prompting</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setBulkEdit(!bulkEdit)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg font-semibold transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Bulk Edit
          </button>
          <button
            onClick={generatePrompts}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Generating...' : 'Regenerate All Prompts'}
          </button>
        </div>
      </div>

      {bulkEdit && (
        <div className="bg-dark-surface rounded-xl p-4 mb-6 border border-accent-primary">
          <h3 className="font-semibold mb-3">Bulk Edit Mode</h3>
          <p className="text-sm text-dark-muted mb-3">
            Add text that will be appended to all prompts
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={bulkEditText}
              onChange={(e) => setBulkEditText(e.target.value)}
              placeholder="e.g., 'Add warm color grading'"
              className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-primary"
            />
            <button
              onClick={applyBulkEdit}
              className="px-4 py-2 bg-accent-success text-white rounded-lg font-semibold hover:bg-accent-success/90 transition-colors"
            >
              Apply to All
            </button>
            <button
              onClick={() => {
                setBulkEdit(false);
                setBulkEditText('');
              }}
              className="px-4 py-2 bg-dark-elevated text-dark-text rounded-lg font-semibold hover:bg-dark-border transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-elevated border-b border-dark-border">
                <th className="text-left px-4 py-3 text-sm font-semibold w-1/4">
                  Script Line
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold w-1/3">
                  Generated Prompt
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold w-1/3">
                  Edited Prompt
                </th>
                <th className="text-center px-4 py-3 text-sm font-semibold w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {prompts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-dark-muted">
                    {generating
                      ? 'Generating prompts...'
                      : 'No prompts generated yet. Click "Regenerate All Prompts" to start.'}
                  </td>
                </tr>
              ) : (
                prompts.map((prompt, index) => (
                  <tr
                    key={prompt.id}
                    className={`border-b border-dark-border ${
                      index % 2 === 0 ? 'bg-dark-bg' : 'bg-dark-surface'
                    } hover:bg-dark-elevated transition-colors`}
                  >
                    <td className="px-4 py-4 text-sm align-top">
                      <div className="line-clamp-3">{prompt.scriptLine}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-dark-muted align-top">
                      <div className="line-clamp-3">
                        {prompt.generatedPrompt}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm align-top">
                      {editingId === prompt.id ? (
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full bg-dark-bg border border-accent-primary rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                          rows={3}
                        />
                      ) : (
                        <div
                          className={`line-clamp-3 ${
                            prompt.editedPrompt
                              ? 'text-accent-success'
                              : 'text-dark-muted italic'
                          }`}
                        >
                          {prompt.editedPrompt || 'No edits yet'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center justify-center gap-1">
                        {editingId === prompt.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(prompt.id)}
                              className="p-2 bg-accent-success hover:bg-accent-success/90 text-white rounded-lg transition-colors"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-accent-danger hover:bg-accent-danger/90 text-white rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(prompt)}
                            className="p-2 bg-dark-elevated hover:bg-dark-border text-dark-text rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleComplete}
          disabled={prompts.length === 0}
          className="px-6 py-3 bg-accent-success hover:bg-accent-success/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete & Continue to Video Generation
        </button>
      </div>
    </div>
  );
}
