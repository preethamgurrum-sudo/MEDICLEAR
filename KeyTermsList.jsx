import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const severityConfig = {
  normal: { label: 'Normal', className: 'bg-accent/10 text-accent border-accent/20' },
  attention: { label: 'Needs Attention', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  urgent: { label: 'Urgent', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function KeyTermsList({ terms }) {
  if (!terms || terms.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          Key Medical Terms Explained
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {terms.map((item, index) => {
            const config = severityConfig[item.severity] || severityConfig.normal;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-foreground text-sm">
                    {item.term}
                  </span>
                  <Badge variant="outline" className={config.className}>
                    {config.label}
                  </Badge>
                </div>
                {item.original_context && (
                  <p className="text-xs text-muted-foreground italic">
                    "{item.original_context}"
                  </p>
                )}
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {item.simple_explanation}
                </p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}