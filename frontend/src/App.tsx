import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import CommandPalette from '@/components/shared/CommandPalette'
import BookmarksPanel from '@/components/shared/Bookmarks'

const ModelTracker = lazy(() => import('@/components/tabs/ModelTracker/ModelTracker'))
const ModelDetail = lazy(() => import('@/components/tabs/ModelTracker/ModelDetail'))
const BenchmarkEngine = lazy(() => import('@/components/tabs/BenchmarkEngine/BenchmarkEngine'))
const BenchmarkDetail = lazy(() => import('@/components/tabs/BenchmarkEngine/BenchmarkDetail'))
const Leaderboard = lazy(() => import('@/components/tabs/Leaderboard/Leaderboard'))
const ComparisonLab = lazy(() => import('@/components/tabs/ComparisonLab/ComparisonLab'))
const SetupGuide = lazy(() => import('@/components/tabs/SetupGuide/SetupGuide'))
const NewsFeed = lazy(() => import('@/components/tabs/NewsFeed/NewsFeed'))
const Playground = lazy(() => import('@/components/tabs/Playground/Playground'))
const LearnHub = lazy(() => import('@/components/tabs/LearnHub/LearnHub'))

function PageLoader() {
  return (
    <div className="space-y-4 pt-8">
      <LoadingSkeleton variant="card" height="200" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LoadingSkeleton variant="card" height="280" />
        <LoadingSkeleton variant="card" height="280" />
        <LoadingSkeleton variant="card" height="280" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <CommandPalette />
      <Routes>
        <Route element={
          <Suspense fallback={<PageLoader />}>
            <AppShell />
          </Suspense>
        }>
          <Route index element={<Navigate to="/models" replace />} />
          <Route path="models" element={<ModelTracker />} />
          <Route path="models/:modelId" element={<ModelDetail />} />
          <Route path="benchmarks" element={<BenchmarkEngine />} />
          <Route path="benchmarks/:benchmarkId" element={<BenchmarkDetail />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="compare" element={<ComparisonLab />} />
          <Route path="guide" element={<SetupGuide />} />
          <Route path="news" element={<NewsFeed />} />
          <Route path="playground" element={<Playground />} />
          <Route path="learn" element={<LearnHub />} />
          <Route path="*" element={<Navigate to="/models" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}