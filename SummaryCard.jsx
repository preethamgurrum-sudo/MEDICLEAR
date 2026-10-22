import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileHeart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function SummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileHeart className="w-4 h-4 text-primary" />
          </div>
          Summary in Simple Terms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-foreground/90">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}