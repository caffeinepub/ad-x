import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  ChevronLeft,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

interface AdminStats {
  totalUsers: bigint;
  totalCompanies: bigint;
  totalBuyingIntents: bigint;
  interestBreakdown: Array<{ category: string; count: bigint }>;
  intentCategoryBreakdown: Array<{ category: string; count: bigint }>;
}

interface CompanyEntry {
  principal: string;
  profile: { name: string; productCategory: string };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  ocid,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  ocid: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="card-glow bg-card rounded-2xl p-6 border border-border/60"
      data-ocid={ocid}
    >
      <div
        className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-3xl font-bold tracking-tight mb-1">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function BarRow({
  label,
  count,
  max,
}: { label: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-36 text-sm text-muted-foreground truncate flex-shrink-0">
        {label}
      </div>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-8 text-right text-sm font-medium">{count}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { actor, isFetching: actorLoading } = useActor();

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).isCallerAdmin();
    },
    enabled: !!actor && !actorLoading && isLoggedIn,
  });

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isRefetching,
  } = useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return (actor as any).getAdminDashboardStats();
    },
    enabled: !!actor && !actorLoading && !!isAdmin,
  });

  const { data: companies, isLoading: companiesLoading } = useQuery<
    CompanyEntry[]
  >({
    queryKey: ["adminCompanies"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAdminAllCompanies();
    },
    enabled: !!actor && !actorLoading && !!isAdmin,
  });

  if (!isLoggedIn) {
    return (
      <div className="mesh-bg noise-overlay min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border/60 rounded-2xl p-10 max-w-sm w-full text-center"
          data-ocid="admin.login.card"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-sm mb-7">
            Sign in with your Internet Identity to access the admin dashboard.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-primary hover:bg-primary/90"
            data-ocid="admin.login.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>
          <div className="mt-6">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="admin.home.link"
            >
              ← Back to AdsX
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (checkingAdmin || actorLoading) {
    return (
      <div
        className="mesh-bg noise-overlay min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mesh-bg noise-overlay min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-destructive/40 rounded-2xl p-10 max-w-sm w-full text-center"
          data-ocid="admin.access_denied.card"
        >
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-7 h-7 text-destructive" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-sm mb-7">
            You do not have admin privileges. Only the AdsX founder can access
            this page.
          </p>
          <Link to="/">
            <Button
              variant="outline"
              className="w-full"
              data-ocid="admin.denied.home.button"
            >
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const totalUsers = Number(stats?.totalUsers ?? 0);
  const totalCompanies = Number(stats?.totalCompanies ?? 0);
  const totalIntents = Number(stats?.totalBuyingIntents ?? 0);
  const interestBreakdown = stats?.interestBreakdown ?? [];
  const intentBreakdown = stats?.intentCategoryBreakdown ?? [];
  const activeCategories = interestBreakdown.filter(
    (c) => Number(c.count) > 0,
  ).length;
  const maxInterest = Math.max(
    ...interestBreakdown.map((c) => Number(c.count)),
    1,
  );
  const maxIntent = Math.max(...intentBreakdown.map((c) => Number(c.count)), 1);

  return (
    <div className="mesh-bg noise-overlay min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-border/30">
        <div className="flex items-center gap-4">
          <Link to="/" data-ocid="admin.back.link">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/adsx-logo-white.dim_400x120.png"
              alt="AdsX"
              className="h-6 w-auto"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 text-xs"
          >
            Admin Dashboard
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchStats()}
            disabled={isRefetching}
            data-ocid="admin.refresh.button"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Internal admin view — AdsX platform overview
          </p>
        </motion.div>

        {statsLoading ? (
          <div
            className="flex items-center justify-center py-24"
            data-ocid="admin.stats.loading_state"
          >
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            >
              <StatCard
                icon={Users}
                label="Total Users"
                value={totalUsers}
                color="text-blue-400"
                ocid="admin.users.card"
              />
              <StatCard
                icon={Building2}
                label="Companies Registered"
                value={totalCompanies}
                color="text-cyan-400"
                ocid="admin.companies.card"
              />
              <StatCard
                icon={ShoppingBag}
                label="Buying Intent Submissions"
                value={totalIntents}
                color="text-violet-400"
                ocid="admin.intents.card"
              />
              <StatCard
                icon={BarChart3}
                label="Active Interest Categories"
                value={activeCategories}
                color="text-emerald-400"
                ocid="admin.categories.card"
              />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Interest Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card border border-border/60 rounded-2xl p-6"
                data-ocid="admin.interest.panel"
              >
                <h2 className="font-display text-lg font-semibold mb-1">
                  Interest Breakdown
                </h2>
                <p className="text-xs text-muted-foreground mb-5">
                  Users per interest category
                </p>
                {interestBreakdown.length === 0 ? (
                  <div
                    className="text-center py-10 text-muted-foreground text-sm"
                    data-ocid="admin.interest.empty_state"
                  >
                    No interest data yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {interestBreakdown
                      .slice()
                      .sort((a, b) => Number(b.count) - Number(a.count))
                      .map((item) => (
                        <BarRow
                          key={item.category}
                          label={item.category}
                          count={Number(item.count)}
                          max={maxInterest}
                        />
                      ))}
                  </div>
                )}
              </motion.div>

              {/* Buying Intent Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card border border-border/60 rounded-2xl p-6"
                data-ocid="admin.intent.panel"
              >
                <h2 className="font-display text-lg font-semibold mb-1">
                  Buying Intent Categories
                </h2>
                <p className="text-xs text-muted-foreground mb-5">
                  Submissions per product category
                </p>
                {intentBreakdown.length === 0 ? (
                  <div
                    className="text-center py-10 text-muted-foreground text-sm"
                    data-ocid="admin.intent.empty_state"
                  >
                    No buying intent data yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {intentBreakdown
                      .slice()
                      .sort((a, b) => Number(b.count) - Number(a.count))
                      .map((item) => (
                        <BarRow
                          key={item.category}
                          label={item.category}
                          count={Number(item.count)}
                          max={maxIntent}
                        />
                      ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Companies Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-card border border-border/60 rounded-2xl overflow-hidden"
              data-ocid="admin.companies.table"
            >
              <div className="px-6 py-5 border-b border-border/40">
                <h2 className="font-display text-lg font-semibold">
                  Registered Companies
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All brands on the AdsX platform
                </p>
              </div>
              {companiesLoading ? (
                <div
                  className="flex items-center justify-center py-16"
                  data-ocid="admin.companies.loading_state"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : !companies || companies.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground text-sm"
                  data-ocid="admin.companies.empty_state"
                >
                  No companies registered yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        #
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Company Name
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Category
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                        Principal ID
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((c, i) => (
                      <TableRow
                        key={c.principal}
                        className="border-border/30 hover:bg-muted/30 transition-colors"
                        data-ocid={`admin.companies.row.${i + 1}` as string}
                      >
                        <TableCell className="text-muted-foreground text-sm">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {c.profile.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary border-primary/20"
                          >
                            {c.profile.productCategory}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono hidden md:table-cell truncate max-w-[200px]">
                          {c.principal}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>Admin Dashboard · AdsX Internal</span>
          <span>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
