import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, ArrowRight, Inbox, Trash2, Search, Filter, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const REPORT_TYPE_LABELS = {
  lab_results: "Lab Results",
  prescription: "Prescription",
  discharge_summary: "Discharge Summary",
  radiology: "Radiology",
  pathology: "Pathology",
  other: "Report",
  general_report: "Report",
};

const LANGUAGE_LABELS = {
  en: "🇬🇧 English",
  es: "🇪🇸 Español",
  hi: "🇮🇳 Hindi",
  te: "🇮🇳 Telugu",
  ta: "🇮🇳 Tamil",
  kn: "🇮🇳 Kannada",
  ml: "🇮🇳 Malayalam",
  mr: "🇮🇳 Marathi",
  bn: "🇮🇳 Bengali",
  gu: "🇮🇳 Gujarati",
  pa: "🇮🇳 Punjabi",
  ar: "🇸🇦",
  fr: "🇫🇷",
  zh: "🇨🇳",
  pt: "🇧🇷",
  de: "🇩🇪",
};

export default function History() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const auraChats = (() => {
    try {
      return JSON.parse(localStorage.getItem("aura_chat_history") || "[]");
    } catch(e) { return []; }
  })();
  const hasAuraChats = auraChats.length > 1;

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const stored = localStorage.getItem("reports");
      return stored ? JSON.parse(stored) : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const stored = JSON.parse(localStorage.getItem("reports") || "[]");
      const updated = stored.filter((r) => r.id !== id);
      localStorage.setItem("reports", JSON.stringify(updated));
      return true;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.id?.includes(searchQuery);
    const matchesType = filterType === "all" || r.report_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Report History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your previously analyzed medical reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input 
              placeholder="Search reports..." 
              className="pl-9 w-full md:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="lab_results">Lab Results</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="radiology">Radiology</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredReports.length === 0 && (!hasAuraChats || filterType !== "all" || !!searchQuery) ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-medium text-foreground mb-2">
            No reports found
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            Upload your first medical report or adjust your search filters.
          </p>

          <Link to="/">
            <Button>
              Analyze a Report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {hasAuraChats && filterType === "all" && !searchQuery && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-primary/50 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => window.dispatchEvent(new Event('open-aura'))}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">Aura Assistant Logs</h4>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="border-primary/30 text-primary">Chat History</Badge>
                        <span className="flex items-center">{Math.floor(auraChats.length / 2)} interactions saved</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground pr-2">
                     <ArrowRight className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <Link
                      to={`/report/${report.id}`}
                      className="font-medium text-sm hover:text-primary"
                    >
                      {report.title}
                    </Link>

                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="secondary">
                        {REPORT_TYPE_LABELS[
                          report.report_type
                        ] || "Report"}
                      </Badge>

                      <Badge variant="outline" className="border-border">
                        {LANGUAGE_LABELS[report.language] || report.language}
                      </Badge>

                      <Badge variant="outline" className={`border-border ${
                        report.severity === 'critical' ? 'text-destructive border-red-200' :
                        report.severity === 'warning' ? 'text-yellow-600 border-yellow-200' : ''
                      }`}>
                         Severity: {report.severity || 'Normal'}
                      </Badge>

                      <span className="flex items-center ml-1">
                        {format(
                          new Date(report.created_date),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      deleteMutation.mutate(report.id)
                    }
                    className="text-muted-foreground px-2 py-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors ml-4"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}