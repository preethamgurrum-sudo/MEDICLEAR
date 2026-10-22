import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { LanguageProvider } from "./contexts/LanguageContext";

import PageNotFound from "./lib/PageNotFound";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/home";
import ReportView from "./pages/ReportView";
import History from "./pages/History";

import Login from "./pages/Login";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <Routes>
              {/* Standalone Pages */}
              <Route path="/login" element={<Login />} />

              {/* App Layout Pages */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/report/:id" element={<ReportView />} />
                <Route path="/history" element={<History />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>

          <Toaster />
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;