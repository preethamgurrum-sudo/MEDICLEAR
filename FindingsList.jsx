import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  normal: { label: 'Normal', icon: CheckCircle, className: 'bg-accent/10 text-accent border-accent/20' },
  abnormal: { label: 'Abnormal', icon: AlertTriangle, className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  critical: { label: 'Critical', icon: AlertCircle, className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function FindingsList({ findings }) {
  if (!findings || findings.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          Key Findings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {findings.map((item, index) => {
            const config = statusConfig[item.status] || statusConfig.normal;
            const Icon = config.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 p-4 rounded-xl bg-muted/50 border border-border/50"
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${
                  item.status === 'normal' ? 'text-accent' :
                  item.status === 'abnormal' ? 'text-yellow-500' : 'text-destructive'
                }`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-medium text-sm text-foreground">{item.finding}</span>
                    <Badge variant="outline" className={config.className}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}