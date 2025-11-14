'use client';

import { useState, useEffect } from 'react';
import { Idea } from '@/app/page';
import { TrendingUp, ExternalLink, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

interface IdeaGenerationProps {
  onApprove: (idea: Idea) => void;
}

const MOCK_IDEAS: Omit<Idea, 'id' | 'approved'>[] = [
  {
    title: 'AI Breakthrough in Climate Modeling',
    description: 'New AI system predicts climate patterns with 95% accuracy, potentially revolutionizing weather forecasting and climate change mitigation strategies.',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    sentiment: 'positive',
    audienceInterest: 'high',
  },
  {
    title: 'Quantum Computing Reaches New Milestone',
    description: 'Scientists achieve quantum supremacy with 1000-qubit processor, opening doors for solving previously impossible computational problems.',
    source: 'Nature',
    sourceUrl: 'https://nature.com',
    sentiment: 'positive',
    audienceInterest: 'high',
  },
  {
    title: 'Global Tech Layoffs Continue',
    description: 'Major tech companies announce another round of workforce reductions amid economic uncertainty and market pressures.',
    source: 'Bloomberg',
    sourceUrl: 'https://bloomberg.com',
    sentiment: 'negative',
    audienceInterest: 'medium',
  },
  {
    title: 'New Programming Language Gains Traction',
    description: 'Developers are rapidly adopting a new systems programming language that promises better memory safety and performance.',
    source: 'GitHub Blog',
    sourceUrl: 'https://github.blog',
    sentiment: 'neutral',
    audienceInterest: 'medium',
  },
  {
    title: 'Breakthrough in Battery Technology',
    description: 'Researchers develop solid-state batteries with 3x capacity and faster charging times, potentially transforming electric vehicles.',
    source: 'MIT Tech Review',
    sourceUrl: 'https://technologyreview.com',
    sentiment: 'positive',
    audienceInterest: 'high',
  },
  {
    title: 'Social Media Platform Updates Privacy Policy',
    description: 'Major platform revises data collection practices following regulatory pressure from multiple governments.',
    source: 'The Verge',
    sourceUrl: 'https://theverge.com',
    sentiment: 'neutral',
    audienceInterest: 'low',
  },
];

export default function IdeaGeneration({ onApprove }: IdeaGenerationProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loadedIdeas = MOCK_IDEAS.map((idea, index) => ({
        ...idea,
        id: `idea-${index}`,
        approved: null,
      }));
      setIdeas(loadedIdeas);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleApproval = (ideaId: string, approved: boolean) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, approved } : idea
      )
    );

    if (approved) {
      const approvedIdea = ideas.find((i) => i.id === ideaId);
      if (approvedIdea) {
        onApprove(approvedIdea);
      }
    }
  };

  const getSentimentColor = (sentiment: Idea['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'text-accent-success';
      case 'negative':
        return 'text-accent-danger';
      default:
        return 'text-dark-muted';
    }
  };

  const getInterestBadge = (interest: Idea['audienceInterest']) => {
    const colors = {
      high: 'bg-accent-success/20 text-accent-success border-accent-success/30',
      medium: 'bg-accent-warning/20 text-accent-warning border-accent-warning/30',
      low: 'bg-dark-elevated text-dark-muted border-dark-border',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[interest]}`}
      >
        {interest.toUpperCase()} INTEREST
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent-primary mx-auto mb-4" />
          <p className="text-dark-muted">Scraping trending news data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-accent-primary" />
        <h2 className="text-2xl font-bold">Trending Ideas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className={`bg-dark-surface rounded-xl p-6 border transition-all ${
              idea.approved === true
                ? 'border-accent-success'
                : idea.approved === false
                ? 'border-accent-danger'
                : 'border-dark-border hover:border-dark-border/60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              {getInterestBadge(idea.audienceInterest)}
              <a
                href={idea.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-secondary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
              {idea.title}
            </h3>

            <p className="text-dark-muted text-sm mb-4 line-clamp-3">
              {idea.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-dark-muted">{idea.source}</span>
              <span
                className={`text-xs font-semibold ${getSentimentColor(
                  idea.sentiment
                )}`}
              >
                {idea.sentiment.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApproval(idea.id, true)}
                disabled={idea.approved !== null}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                  idea.approved === true
                    ? 'bg-accent-success text-white'
                    : 'bg-dark-elevated hover:bg-accent-success/20 hover:text-accent-success text-dark-text'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsUp className="w-4 h-4" />
                Approve
              </button>

              <button
                onClick={() => handleApproval(idea.id, false)}
                disabled={idea.approved !== null}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                  idea.approved === false
                    ? 'bg-accent-danger text-white'
                    : 'bg-dark-elevated hover:bg-accent-danger/20 hover:text-accent-danger text-dark-text'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsDown className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
