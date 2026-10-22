import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Type } from 'lucide-react';

export default function TextInput({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Type className="w-4 h-4 text-primary" />
        Or paste report text
      </label>
      <Textarea
        placeholder="Paste your medical report text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[140px] bg-card resize-none text-sm"
      />
    </div>
  );
}