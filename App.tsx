import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { HistoryPage } from './pages/HistoryPage';
import { PeriodDetailPage } from './pages/PeriodDetailPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { LiteraryTermsPage } from './pages/LiteraryTermsPage';
import { ResourceLibraryPage } from './pages/ResourceLibraryPage';
import { AssistantPage } from './pages/AssistantPage';
import { NotesGeneratorPage } from './pages/NotesGeneratorPage';
import { QuizGeneratorPage } from './pages/QuizGeneratorPage';
import { PoetryAnalysisPage } from './pages/PoetryAnalysisPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ExamCenterPage } from './pages/ExamCenterPage';
import { AboutCreatorPage } from './pages/AboutCreatorPage';
import { SubjectsPage } from './pages/subjects/SubjectsPage';
import { BritishNovelPage, BritishPoetryPage, AmericanLitPage, IndianWritingsPage } from './pages/subjects/HubPages';
import { CommunicationPage } from './pages/subjects/CommunicationPage';
import { WorkDetailPage } from './pages/subjects/WorkDetailPage';
import { IndianWritersPage } from './pages/IndianWritersPage';
import { IndianWriterDetailPage } from './pages/IndianWriterDetailPage';
import { AcademicGeneratorsPage } from './pages/AcademicGeneratorsPage';
import { novels } from './data/subjects/novels';
import { poems } from './data/subjects/poetry';
import { americanAll, indianAll } from './data/subjects/index';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="history/:periodId" element={<PeriodDetailPage />} />
              <Route path="authors" element={<AuthorsPage />} />
              <Route path="authors/:authorId" element={<AuthorDetailPage />} />
              <Route path="terms" element={<LiteraryTermsPage />} />
              <Route path="subjects" element={<SubjectsPage />} />
              <Route path="subjects/novel" element={<BritishNovelPage />} />
              <Route path="subjects/novel/:workId" element={<WorkDetailPage hub="novel" works={novels} basePath="/subjects/novel" />} />
              <Route path="subjects/poetry" element={<BritishPoetryPage />} />
              <Route path="subjects/poetry/:workId" element={<WorkDetailPage hub="poetry" works={poems} basePath="/subjects/poetry" />} />
              <Route path="subjects/american" element={<AmericanLitPage />} />
              <Route path="subjects/american/:workId" element={<WorkDetailPage hub="american" works={americanAll} basePath="/subjects/american" />} />
              <Route path="subjects/indian" element={<IndianWritingsPage />} />
              <Route path="subjects/indian/:workId" element={<WorkDetailPage hub="indian" works={indianAll} basePath="/subjects/indian" />} />
              <Route path="subjects/communication" element={<CommunicationPage />} />
              <Route path="indian-writers" element={<IndianWritersPage />} />
              <Route path="indian-writers/:writerId" element={<IndianWriterDetailPage />} />
              <Route path="exams" element={<ExamCenterPage />} />
              <Route path="about-creator" element={<AboutCreatorPage />} />
              <Route path="library" element={<ResourceLibraryPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="notes" element={<NotesGeneratorPage />} />
              <Route path="generators" element={<AcademicGeneratorsPage />} />
              <Route path="quiz" element={<QuizGeneratorPage />} />
              <Route path="poetry" element={<PoetryAnalysisPage />} />
              <Route path="planner" element={<StudyPlannerPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
