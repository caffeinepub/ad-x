import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Home,
  Laptop,
  Loader2,
  Shirt,
  Smartphone,
  Target,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ---- Data definitions ----

type Category = "Technology" | "Phones" | "Fashion" | "Home Appliances";

const CATEGORIES: {
  id: Category;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  {
    id: "Technology",
    label: "Technology",
    icon: Laptop,
    desc: "Laptops, desktops & more",
  },
  {
    id: "Phones",
    label: "Phones",
    icon: Smartphone,
    desc: "Android, iPhone & others",
  },
  {
    id: "Fashion",
    label: "Fashion & Clothing",
    icon: Shirt,
    desc: "Apparel, accessories & more",
  },
  {
    id: "Home Appliances",
    label: "Home Appliances",
    icon: Home,
    desc: "Refrigerators, TVs & more",
  },
];

type SubMap = Record<Category, string[]>;
const SUBCATEGORIES: SubMap = {
  Technology: ["Laptop", "Desktop"],
  Phones: ["Android Phone", "iPhone"],
  Fashion: ["Men's Clothing", "Women's Clothing", "Sportswear", "Ethnic Wear"],
  "Home Appliances": [
    "Refrigerator",
    "Washing Machine",
    "AC",
    "TV",
    "Microwave",
  ],
};

type Question = { question: string; options: string[] };

const QUESTIONS: Record<string, Question[]> = {
  Laptop: [
    {
      question: "Usage type",
      options: ["Gaming", "Business", "Student", "Casual"],
    },
    {
      question: "OS preference",
      options: ["Windows", "macOS", "Linux", "ChromeOS"],
    },
    { question: "RAM", options: ["8GB", "16GB", "32GB+"] },
    {
      question: "Processor tier",
      options: ["Entry-level", "Mid-range", "High-end"],
    },
    {
      question: "Budget",
      options: ["Under ₹30k", "₹30k–60k", "₹60k–1L", "Above ₹1L"],
    },
  ],
  Desktop: [
    { question: "Usage", options: ["Gaming", "Work", "Creative", "General"] },
    { question: "Processor tier", options: ["Entry", "Mid", "High-end"] },
    { question: "RAM", options: ["8GB", "16GB", "32GB+"] },
    { question: "Budget", options: ["Under ₹40k", "₹40k–80k", "Above ₹80k"] },
  ],
  "Android Phone": [
    {
      question: "Brand preference",
      options: ["Samsung", "OnePlus", "Xiaomi", "Realme", "Other"],
    },
    { question: "Storage", options: ["64GB", "128GB", "256GB+"] },
    {
      question: "Priority",
      options: ["Camera", "Battery", "Performance", "Value"],
    },
    {
      question: "Budget",
      options: ["Under ₹15k", "₹15k–30k", "₹30k–50k", "Above ₹50k"],
    },
  ],
  iPhone: [
    {
      question: "Model tier",
      options: ["iPhone SE", "iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max"],
    },
    { question: "Storage", options: ["128GB", "256GB", "512GB+"] },
    { question: "Budget", options: ["Under ₹60k", "₹60k–1L", "Above ₹1L"] },
  ],
  "Men's Clothing": [
    {
      question: "Style",
      options: ["Casual", "Formal", "Trendy", "Minimalist"],
    },
    {
      question: "Preferred brands",
      options: ["Local", "National", "International", "No preference"],
    },
    {
      question: "Budget per piece",
      options: ["Under ₹500", "₹500–2k", "₹2k–5k", "Above ₹5k"],
    },
  ],
  "Women's Clothing": [
    {
      question: "Style",
      options: ["Casual", "Formal", "Trendy", "Minimalist"],
    },
    {
      question: "Preferred brands",
      options: ["Local", "National", "International", "No preference"],
    },
    {
      question: "Budget per piece",
      options: ["Under ₹500", "₹500–2k", "₹2k–5k", "Above ₹5k"],
    },
  ],
  Sportswear: [
    {
      question: "Style",
      options: ["Casual", "Formal", "Trendy", "Minimalist"],
    },
    {
      question: "Preferred brands",
      options: ["Local", "National", "International", "No preference"],
    },
    {
      question: "Budget per piece",
      options: ["Under ₹500", "₹500–2k", "₹2k–5k", "Above ₹5k"],
    },
  ],
  "Ethnic Wear": [
    {
      question: "Style",
      options: ["Casual", "Formal", "Trendy", "Minimalist"],
    },
    {
      question: "Preferred brands",
      options: ["Local", "National", "International", "No preference"],
    },
    {
      question: "Budget per piece",
      options: ["Under ₹500", "₹500–2k", "₹2k–5k", "Above ₹5k"],
    },
  ],
  Refrigerator: [
    {
      question: "Brand preference",
      options: ["Budget", "Mid-range", "Premium"],
    },
    { question: "Star rating", options: ["3-star", "4-star", "5-star"] },
    {
      question: "Budget",
      options: ["Under ₹15k", "₹15k–30k", "₹30k–50k", "Above ₹50k"],
    },
  ],
  "Washing Machine": [
    {
      question: "Brand preference",
      options: ["Budget", "Mid-range", "Premium"],
    },
    { question: "Star rating", options: ["3-star", "4-star", "5-star"] },
    {
      question: "Budget",
      options: ["Under ₹15k", "₹15k–30k", "₹30k–50k", "Above ₹50k"],
    },
  ],
  AC: [
    {
      question: "Brand preference",
      options: ["Budget", "Mid-range", "Premium"],
    },
    { question: "Star rating", options: ["3-star", "4-star", "5-star"] },
    {
      question: "Budget",
      options: ["Under ₹15k", "₹15k–30k", "₹30k–50k", "Above ₹50k"],
    },
  ],
  TV: [
    {
      question: "Brand preference",
      options: ["Budget", "Mid-range", "Premium"],
    },
    { question: "Star rating", options: ["3-star", "4-star", "5-star"] },
    {
      question: "Budget",
      options: ["Under ₹15k", "₹15k–30k", "₹30k–50k", "Above ₹50k"],
    },
  ],
  Microwave: [
    {
      question: "Brand preference",
      options: ["Budget", "Mid-range", "Premium"],
    },
    { question: "Star rating", options: ["3-star", "4-star", "5-star"] },
    {
      question: "Budget",
      options: ["Under ₹15k", "₹15k–30k", "₹30k–50k", "Above ₹50k"],
    },
  ],
};

// ---- Component ----

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

export default function BuyingIntent() {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const questions = subcategory ? (QUESTIONS[subcategory] ?? []) : [];
  const totalSteps = 3;

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setSubcategory(null);
    setAnswers({});
    setStep(2);
  };

  const handleSubcategorySelect = (sub: string) => {
    setSubcategory(sub);
    setAnswers({});
    setStep(3);
  };

  const handleAnswer = (question: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [question]: option }));
  };

  const allAnswered =
    questions.length > 0 && questions.every((q) => answers[q.question]);

  const handleSubmit = async () => {
    if (!category || !subcategory) return;
    setIsSaving(true);
    try {
      const intentData = {
        category,
        subcategory,
        answers: Object.entries(answers).map(([question, answer]) => ({
          question,
          answer,
        })),
        timestamp: Date.now(),
      };
      const existing = JSON.parse(
        localStorage.getItem("buyingIntents") ?? "[]",
      );
      existing.push(intentData);
      localStorage.setItem("buyingIntents", JSON.stringify(existing));
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Your buying intent saved! Brands will now find you.");
      // Reset
      setStep(1);
      setCategory(null);
      setSubcategory(null);
      setAnswers({});
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isInitializing) {
    return (
      <div
        className="min-h-screen mesh-bg flex items-center justify-center"
        data-ocid="intent.loading_state"
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
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-700 mb-3">
            Sign in to continue
          </h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Sign in to tell brands exactly what you want to buy.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-primary hover:bg-primary/90 py-5"
            data-ocid="intent.login.primary_button"
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
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" data-ocid="intent.nav.link">
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
          {step > 1 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all ${
                      s < step
                        ? "bg-primary text-primary-foreground"
                        : s === step
                          ? "bg-primary/20 text-primary border border-primary/40"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s < step ? <CheckCircle className="w-3 h-3" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-6 h-px ${s < step ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* Step 1: Category */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="mb-10">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                  Step 1 of {totalSteps}
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-800 mb-2">
                  What do you want to buy?
                </h1>
                <p className="text-muted-foreground">
                  Pick a category to get started.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.07 },
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-card border border-border/50 hover:border-primary/60 hover:bg-primary/5 rounded-2xl p-6 text-left transition-all duration-200 card-glow"
                    data-ocid={`intent.category.item.${i + 1}`}
                  >
                    <cat.icon className="w-8 h-8 text-primary mb-4" />
                    <div className="font-semibold text-sm mb-1">
                      {cat.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cat.desc}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Subcategory */}
          {step === 2 && category && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="mb-10">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
                  type="button"
                  data-ocid="intent.back.button"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                  Step 2 of {totalSteps} · {category}
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-800 mb-2">
                  Which type?
                </h1>
                <p className="text-muted-foreground">
                  Be specific so we can match the right brands.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SUBCATEGORIES[category].map((sub, i) => (
                  <motion.button
                    key={sub}
                    onClick={() => handleSubcategorySelect(sub)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.07 },
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-card border border-border/50 hover:border-primary/60 hover:bg-primary/5 rounded-2xl p-6 text-center font-semibold text-sm transition-all duration-200 card-glow"
                    data-ocid={`intent.subcategory.item.${i + 1}`}
                  >
                    {sub}
                    <ArrowRight className="w-3 h-3 mx-auto mt-2 text-muted-foreground" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: MCQ Questions */}
          {step === 3 && subcategory && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="mb-10">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
                  type="button"
                  data-ocid="intent.back.button"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                  Step 3 of {totalSteps} · {category} › {subcategory}
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-800 mb-2">
                  Your preferences
                </h1>
                <p className="text-muted-foreground">
                  Select one option per question.
                </p>
              </div>

              <div className="space-y-8">
                {questions.map((q, qi) => (
                  <motion.div
                    key={q.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: qi * 0.08 },
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
                        {qi + 1}
                      </span>
                      <h3 className="font-semibold text-sm">{q.question}</h3>
                      {answers[q.question] && (
                        <CheckCircle className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.question] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(q.question, opt)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-card border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            }`}
                            type="button"
                            data-ocid="intent.option.toggle"
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary & Submit */}
              <AnimatePresence>
                {allAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-10 bg-card border border-primary/30 rounded-2xl p-6"
                    data-ocid="intent.summary.card"
                  >
                    <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Your Summary — {category} › {subcategory}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Object.entries(answers).map(([q, a]) => (
                        <span
                          key={q}
                          className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1"
                        >
                          {q}: <strong>{a}</strong>
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSaving}
                      className="bg-primary hover:bg-primary/90 w-full"
                      data-ocid="intent.submit.primary_button"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>Submit &amp; Save — Let Brands Find You</>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 px-6 mt-10">
        <div className="max-w-3xl mx-auto text-center text-xs text-muted-foreground">
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
