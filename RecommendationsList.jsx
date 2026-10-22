import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecommendationsList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-accent" />
          </div>
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3 items-start"
            >
              <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-accent">{index + 1}</span>
              </span>
              <p className="text-sm text-foreground/80 leading-relaxed">{rec}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}