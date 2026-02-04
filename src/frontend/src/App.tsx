import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { SoundProvider } from './contexts/SoundContext';
import AuthGate from './components/auth/AuthGate';
import ProfileGate from './components/profile/ProfileGate';
import AppLayout from './components/app/AppLayout';
import ProfilePage from './pages/ProfilePage';
import CirclePage from './pages/CirclePage';
import ComposeStatusPage from './pages/ComposeStatusPage';
import DailyCheckInPage from './pages/DailyCheckInPage';
import FeedPage from './pages/FeedPage';
import NotificationsPage from './pages/NotificationsPage';
import StatusDetailPage from './pages/StatusDetailPage';

const rootRoute = createRootRoute({
  component: () => (
    <AuthGate>
      <ProfileGate>
        <AppLayout />
      </ProfileGate>
    </AuthGate>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FeedPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const circleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circle',
  component: CirclePage,
});

const composeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compose',
  component: ComposeStatusPage,
});

const dailyCheckInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-checkin',
  component: DailyCheckInPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const statusDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/status/$statusId',
  component: StatusDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileRoute,
  circleRoute,
  composeRoute,
  dailyCheckInRoute,
  notificationsRoute,
  statusDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="closecircle-theme">
      <QueryClientProvider client={queryClient}>
        <SoundProvider>
          <RouterProvider router={router} />
          <Toaster />
        </SoundProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
