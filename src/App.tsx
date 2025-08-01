
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Index from "@/pages/Index";
import { ReaderPage } from "@/pages/ReaderPage";
import { ReportPage } from "@/pages/ReportPage";
import VocabularyReviewPage from "@/pages/VocabularyReviewPage";
import MaterialSchemaPage from "@/pages/MaterialSchemaPage";
import NotFound from "@/pages/NotFound";
import ImageReaderPage from "@/pages/ImageReaderPage";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reader/:sessionId" element={<ReaderPage />} />
              <Route path="/report/:sessionId" element={<ReportPage />} />
              <Route path="/review" element={<VocabularyReviewPage />} />
              <Route path="/image-reader/:sessionId" element={<ImageReaderPage />} />
              <Route path="/schema" element={<MaterialSchemaPage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
