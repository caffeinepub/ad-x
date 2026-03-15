import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CheckCircle,
  Dumbbell,
  Gamepad2,
  Heart,
  Home,
  Laptop,
  Loader2,
  Plane,
  Shirt,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCategoryCounts, useSaveCompanyProfile } from "../hooks/useQueries";

const CATEGORIES = [
  {
    id: "Technology",
    label: "Technology",
    icon: Laptop,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: "Fashion",
    label: "Fashion",
    icon: Shirt,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    id: "Food & Dining",
    label: "Food & Dining",
    icon: UtensilsCrossed,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    id: "Travel",
    label: "Travel",
    icon: Plane,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    id: "Sports",
    label: "Sports",
    icon: Dumbbell,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    id: "Health & Wellness",
    label: "Health & Wellness",
    icon: Heart,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    id: "Finance",
    label: "Finance",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    id: "Gaming",
    label: "Gaming",
    icon: Gamepad2,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    id: "Home & Living",
    label: "Home & Living",
    icon: Home,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    id: "Beauty & Skincare",
    label: "Beauty & Skincare",
    icon: Sparkles,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-400/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function CompanyPortal() {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const { mutate: saveCompany, isPending } = useSaveCompanyProfile();
  const { data: categoryCounts } = useCategoryCounts();

  const [companyName, setCompanyName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registeredCategory, setRegisteredCategory] = useState("");

  const handleRegister = () => {
    if (!companyName.trim()) {
      toast.error("Please enter your company name.");
      return;
    }
    if (!productCategory) {
      toast.error("Please select a product category.");
      return;
    }
    saveCompany(
      { name: companyName.trim(), productCategory },
      {
        onSuccess: () => {
          setRegistered(true);
          setRegisteredCategory(productCategory);
          toast.success(`${companyName} registered successfully!`);
        },
        onError: () => toast.error("Registration failed. Please try again."),
      },
    );
  };

  const getCountForCategory = (cat: string) => {
    if (!categoryCounts) return 0;
    const found = categoryCounts.find((c) => c.category === cat);
    return found ? Number(found.count) : 0;
  };

  if (isInitializing) {
    return (
      <div
        className="min-h-screen mesh-bg flex items-center justify-center"
        data-ocid="company.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen mesh-bg noise-overlay flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border/60 rounded-3xl p-10 max-w-sm w-full text-center"
          style={{ boxShadow: "0 40px 80px -20px oklch(0.65 0.22 255 / 0.2)" }}
        >
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-700 mb-3">
            Company Portal
          </h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Register your company and discover verified audience insights across
            all categories.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-5"
            data-ocid="company.login.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Connecting...
              </>
            ) : (
              <>Sign In to Continue</>
            )}
          </Button>
          <Link
            to="/"
            className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg noise-overlay">
      {/* Header */}
      <header className="border-b border-border/40 px-6 py-4 sticky top-0 z-20 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" data-ocid="company.nav.link">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <img
                  src="/assets/generated/adsx-logo-white.dim_400x120.png"
                  alt="AdsX"
                  className="h-5 w-auto"
                />
              </Button>
            </Link>
          </div>
          <Badge
            variant="secondary"
            className="bg-accent/10 text-accent border-accent/20 text-xs"
          >
            <Building2 className="w-3 h-3 mr-1" />
            Company Portal
          </Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="font-display text-4xl font-800 mb-2">
              Audience Intelligence
            </h1>
            <p className="text-muted-foreground">
              Register your company and access verified audience data across
              interest categories.
            </p>
          </motion.div>

          {/* Registration form */}
          <AnimatePresence mode="wait">
            {!registered ? (
              <motion.section
                key="form"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -16 }}
                className="mb-10"
              >
                <div className="bg-card border border-border/60 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-700">
                        Register Your Company
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Enter your details to unlock audience insights
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="company-name"
                        className="text-sm font-medium"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="company-name"
                        placeholder="e.g. Reliance Industries"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-muted/40 border-border/60"
                        data-ocid="company.name.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Product Category
                      </Label>
                      <Select
                        value={productCategory}
                        onValueChange={setProductCategory}
                      >
                        <SelectTrigger
                          className="bg-muted/40 border-border/60"
                          data-ocid="company.category.select"
                        >
                          <SelectValue placeholder="Select your category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleRegister}
                      disabled={isPending}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
                      data-ocid="company.register.primary_button"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                          Registering...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 w-4 h-4" /> Register & View
                          Insights
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex items-center gap-4"
                data-ocid="company.register.success_state"
              >
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <div className="font-medium">
                    {companyName} is registered!
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Your matched category:{" "}
                    <span className="text-primary font-medium">
                      {registeredCategory}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audience Insights */}
          {registered && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="font-display text-2xl font-700">
                  Audience Insights
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 text-xs"
                >
                  Live Data
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {CATEGORIES.map((cat, idx) => {
                  const count = getCountForCategory(cat.id);
                  const isMatch = cat.id === registeredCategory;
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`relative rounded-2xl p-5 border transition-all ${
                        isMatch
                          ? "bg-primary/10 border-primary/40 shadow-glow-sm"
                          : "bg-card border-border/50 card-glow"
                      }`}
                      data-ocid={`audience.item.${idx + 1}`}
                    >
                      {isMatch && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5">
                            Your Match
                          </Badge>
                        </div>
                      )}
                      <div
                        className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center mb-3`}
                      >
                        <cat.icon className={`w-4 h-4 ${cat.color}`} />
                      </div>
                      <div
                        className={`text-xs font-medium mb-2 leading-tight ${isMatch ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {cat.label}
                      </div>
                      <div
                        className={`flex items-center gap-1 ${isMatch ? "text-primary" : "text-foreground"}`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-lg font-display font-700">
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        matched users
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Empty pre-register state */}
          {!registered && (
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-display text-2xl font-700 text-muted-foreground">
                  Audience Insights
                </h2>
                <Badge variant="secondary" className="text-xs">
                  Register to unlock
                </Badge>
              </div>
              <div
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
                data-ocid="audience.empty_state"
              >
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-2xl p-5 border border-border/30 bg-card/50 opacity-40 blur-[1px]"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center mb-3`}
                    >
                      <cat.icon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <div className="text-xs font-medium mb-2 text-muted-foreground">
                      {cat.label}
                    </div>
                    <div className="h-5 bg-muted rounded w-12" />
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 px-6 mt-10">
        <div className="max-w-5xl mx-auto text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
