import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { SoundProvider } from './contexts/SoundContext';
import ProfileGate from './components/profile/ProfileGate';
import AppLayout from './components/app/AppLayout';
import ProfilePage from './pages/ProfilePage';
import CirclePage from './pages/CirclePage';
import ComposeStatusPage from './pages/ComposeStatusPage';
import DailyCheckInPage from './pages/DailyCheckInPage';
import NotificationsPage from './pages/NotificationsPage';
import StatusDetailPage from './pages/StatusDetailPage';
import HomeRoutePage from './pages/HomeRoutePage';
import InviteCodeAuthStepPage from './pages/InviteCodeAuthStepPage';
import StartAuthPage from './pages/StartAuthPage';

// Single root route for the entire app
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes (no auth wrapper)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeRoutePage,
});

const inviteAuthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invite-auth',
  component: InviteCodeAuthStepPage,
});

const startAuthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/start-auth',
  component: StartAuthPage,
});

// Authenticated layout route (pathless, wraps authenticated children)
const authenticatedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: () => (
    <ProfileGate>
      <AppLayout />
    </ProfileGate>
  ),
});

// Authenticated child routes
const profileRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/profile',
  component: ProfilePage,
});

const circleRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/circle',
  component: CirclePage,
});

const composeRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/compose',
  component: ComposeStatusPage,
});

const dailyCheckInRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/daily-checkin',
  component: DailyCheckInPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const statusDetailRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/status/$statusId',
  component: StatusDetailPage,
});

// Build the route tree with a single root
const routeTree = rootRoute.addChildren([
  indexRoute,
  inviteAuthRoute,
  startAuthRoute,
  authenticatedLayoutRoute.addChildren([
    profileRoute,
    circleRoute,
    composeRoute,
    dailyCheckInRoute,
    notificationsRoute,
    statusDetailRoute,
  ]),
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
