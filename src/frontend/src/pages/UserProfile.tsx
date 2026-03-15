import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Dumbbell,
  Gamepad2,
  Heart,
  Home,
  Laptop,
  Loader2,
  Plane,
  Save,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserProfile as UserProfileType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveUserProfile, useUserProfile } from "../hooks/useQueries";

const CATEGORIES = [
  {
    id: "Technology",
    label: "Technology",
    icon: Laptop,
    color: "text-blue-400",
  },
  { id: "Fashion", label: "Fashion", icon: Shirt, color: "text-pink-400" },
  {
    id: "Food & Dining",
    label: "Food & Dining",
    icon: UtensilsCrossed,
    color: "text-orange-400",
  },
  { id: "Travel", label: "Travel", icon: Plane, color: "text-cyan-400" },
  { id: "Sports", label: "Sports", icon: Dumbbell, color: "text-green-400" },
  {
    id: "Health & Wellness",
    label: "Health & Wellness",
    icon: Heart,
    color: "text-red-400",
  },
  {
    id: "Finance",
    label: "Finance",
    icon: TrendingUp,
    color: "text-emerald-400",
  },
  { id: "Gaming", label: "Gaming", icon: Gamepad2, color: "text-violet-400" },
  {
    id: "Home & Living",
    label: "Home & Living",
    icon: Home,
    color: "text-amber-400",
  },
  {
    id: "Beauty & Skincare",
    label: "Beauty & Skincare",
    icon: Sparkles,
    color: "text-fuchsia-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
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

export default function UserProfile() {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: existingProfile } = useUserProfile();
  const { mutate: saveProfile, isPending } = useSaveUserProfile();

  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [shareAge, setShareAge] = useState(false);
  const [shareLocation, setShareLocation] = useState(false);
  const [shareInterests, setShareInterests] = useState(true);
  const [shareIncome, setShareIncome] = useState(false);
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (existingProfile) {
      setInterests(new Set(existingProfile.interests));
      setShareAge(existingProfile.consent.shareAge);
      setShareLocation(existingProfile.consent.shareLocation);
      setShareInterests(existingProfile.consent.shareInterests);
      setAgeRange(existingProfile.demographics.ageRange);
      setLocation(existingProfile.demographics.location);
    }
  }, [existingProfile]);

  const toggleInterest = (id: string) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    const profile: UserProfileType = {
      interests: Array.from(interests),
      consent: { shareAge, shareLocation, shareInterests },
      demographics: { ageRange, location },
    };
    saveProfile(profile, {
      onSuccess: () =>
        toast.success("Profile saved! Your preferences are now active."),
      onError: () => toast.error("Failed to save profile. Please try again."),
    });
  };

  if (isInitializing) {
    return (
      <div
        className="min-h-screen mesh-bg flex items-center justify-center"
        data-ocid="user.loading_state"
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
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-700 mb-3">
            Sign in to AdsX
          </h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Create your preference profile and take control of your ad
            experience.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-primary hover:bg-primary/90 py-5"
            data-ocid="user.login.primary_button"
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
            <Link to="/" data-ocid="user.nav.link">
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
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 text-xs"
            >
              <ShieldCheck className="w-3 h-3 mr-1" />
              Your Data is Protected
            </Badge>
          </div>
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
              Your Ad Preferences
            </h1>
            <p className="text-muted-foreground">
              Select your interests and control your data sharing. You're always
              in charge.
            </p>
          </motion.div>

          {/* Interests */}
          <motion.section variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="font-display text-xl font-700">Your Interests</h2>
              <Badge variant="secondary" className="text-xs">
                {interests.size} selected
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat, idx) => {
                const isActive = interests.has(cat.id);
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => toggleInterest(cat.id)}
                    whileTap={{ scale: 0.96 }}
                    className={`relative rounded-xl p-4 text-left transition-all duration-200 border ${
                      isActive
                        ? "card-active border-primary/60"
                        : "bg-card border-border/50 hover:border-border card-glow"
                    }`}
                    data-ocid={`interests.item.${idx + 1}`}
                    aria-pressed={isActive}
                  >
                    <cat.icon
                      className={`w-5 h-5 mb-2 ${isActive ? "text-primary" : cat.color}`}
                    />
                    <div
                      className={`text-xs font-medium leading-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {cat.label}
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-2 right-2"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* Privacy Controls */}
          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="font-display text-xl font-700 mb-5">
              Privacy Controls
            </h2>
            <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
              {[
                {
                  id: "share-age",
                  label: "Share my age range",
                  desc: "Allows brands to target by age group",
                  value: shareAge,
                  onChange: setShareAge,
                  ocid: "privacy.age.switch",
                },
                {
                  id: "share-location",
                  label: "Share my location",
                  desc: "Enables regional targeting by brands",
                  value: shareLocation,
                  onChange: setShareLocation,
                  ocid: "privacy.location.switch",
                },
                {
                  id: "share-interests",
                  label: "Share my interests with brands",
                  desc: "Required for matching — brands can see your category preferences",
                  value: shareInterests,
                  onChange: setShareInterests,
                  ocid: "privacy.interests.switch",
                  required: true,
                },
                {
                  id: "share-income",
                  label: "Share my income bracket",
                  desc: "Helps luxury and budget brands target appropriately",
                  value: shareIncome,
                  onChange: setShareIncome,
                  ocid: "privacy.income.switch",
                },
              ].map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-6 py-5 ${
                    idx < 3 ? "border-b border-border/40" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={item.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {item.label}
                      </Label>
                      {item.required && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-primary/10 text-primary border-primary/20 px-1.5"
                        >
                          Required for matching
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <Switch
                    id={item.id}
                    checked={item.value}
                    onCheckedChange={item.onChange}
                    data-ocid={item.ocid}
                  />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Demographics */}
          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="font-display text-xl font-700 mb-5">Demographics</h2>
            <p className="text-sm text-muted-foreground mb-5">
              This information is only shared based on your privacy settings
              above.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Age Range</Label>
                <Select value={ageRange} onValueChange={setAgeRange}>
                  <SelectTrigger
                    className="bg-card border-border/60"
                    data-ocid="demographics.age.select"
                  >
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {["18-24", "25-34", "35-44", "45-54", "55+"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location Region</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger
                    className="bg-card border-border/60"
                    data-ocid="demographics.location.select"
                  >
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "North India",
                      "South India",
                      "East India",
                      "West India",
                      "Other",
                    ].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.section>

          {/* Save */}
          <motion.div
            variants={itemVariants}
            className="flex justify-end gap-3 mb-6"
          >
            <Button
              onClick={handleSave}
              disabled={isPending}
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8"
              data-ocid="user.save.primary_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 w-4 h-4" /> Save Preferences
                </>
              )}
            </Button>
          </motion.div>

          {/* Buying Intent CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-2 bg-card border border-border/60 rounded-2xl p-6 text-center"
          >
            <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-display text-lg font-700 mb-2">
              Tell brands what you want to buy
            </h3>
            <p className="text-muted-foreground text-sm mb-5 max-w-sm mx-auto">
              Answer a few MCQ questions about your next purchase and get
              matched with the right brands.
            </p>
            <Link to="/intent">
              <Button
                className="bg-primary hover:bg-primary/90"
                data-ocid="user.intent.primary_button"
              >
                Start Buying Intent Quiz
                <ShoppingBag className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
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
