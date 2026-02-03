import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './components/auth/AuthGate';
import ProfileGate from './components/profile/ProfileGate';
import AppLayout from './components/app/AppLayout';
import ProfilePage from './pages/ProfilePage';
import CirclePage from './pages/CirclePage';
import ComposeStatusPage from './pages/ComposeStatusPage';
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
  notificationsRoute,
  statusDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
