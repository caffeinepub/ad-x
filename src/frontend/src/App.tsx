import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminDashboard from "./pages/AdminDashboard";
import BuyingIntent from "./pages/BuyingIntent";
import CompanyPortal from "./pages/CompanyPortal";
import Landing from "./pages/Landing";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <Toaster />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user",
  component: UserProfile,
});

const companyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/company",
  component: CompanyPortal,
});

const intentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/intent",
  component: BuyingIntent,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  userRoute,
  companyRoute,
  intentRoute,
  adminRoute,
]);

const hashHistory = createHashHistory();
const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export { Link };
