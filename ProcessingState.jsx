import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileSearch, Brain, Languages } from 'lucide-react';

const steps = [
  { icon: FileSearch, label: 'Extracting report data...' },
  { icon: Brain, label: 'Analyzing medical terms...' },
  { icon: Languages, label: 'Generating simplified explanation...' },
];

export default function ProcessingState({ step = 0 }) {
  return (
    <div className="flex flex-col items-center py-16 px-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
      >
        <Loader2 className="w-8 h-8 text-primary" />
      </motion.div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        Analyzing Your Report
      </h3>
      <p className="text-sm text-muted-foreground mb-8 text-center max-w-sm">
        Our AI is reading and simplifying your medical report. This usually takes 15-30 seconds.
      </p>

      <div className="space-y-3 w-full max-w-xs">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = index === step;
          const isDone = index < step;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary/10' : isDone ? 'bg-accent/10' : 'bg-muted/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${
                isActive ? 'text-primary' : isDone ? 'text-accent' : 'text-muted-foreground'
              }`} />
              <span className={`text-sm ${
                isActive ? 'text-primary font-medium' : isDone ? 'text-accent' : 'text-muted-foreground'
              }`}>
                {s.label}
              </span>
              {isActive && (
                <Loader2 className="w-3 h-3 text-primary animate-spin ml-auto" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}