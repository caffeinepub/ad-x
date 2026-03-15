import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Eye,
  Lock,
  Shield,
  ShoppingBag,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const userBenefits = [
  {
    icon: Shield,
    title: "Control Your Data",
    desc: "Decide exactly what you share — age, location, interests. Your data, your rules.",
    color: "text-blue-400",
  },
  {
    icon: Target,
    title: "See Relevant Ads",
    desc: "Only brands you actually care about reach you. No more irrelevant noise cluttering your feed.",
    color: "text-cyan-400",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    desc: "See which companies have access to your profile and revoke it anytime, instantly.",
    color: "text-violet-400",
  },
];

const companyBenefits = [
  { icon: Users, text: "Reach genuinely interested audiences" },
  { icon: BarChart3, text: "Verified category-level audience data" },
  { icon: Zap, text: "Higher conversion from matched users" },
  { icon: Lock, text: "Privacy-compliant targeting" },
];

const stats = [
  { value: "94%", label: "Users prefer relevant ads" },
  { value: "3.2×", label: "Higher engagement rate" },
  { value: "0", label: "Data sold without consent" },
];

export default function Landing() {
  return (
    <div className="mesh-bg noise-overlay min-h-screen overflow-x-hidden">
      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/adsx-logo-white.dim_400x120.png"
            alt="AdsX"
            className="h-8 w-auto"
          />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            to="/"
            className="hover:text-foreground transition-colors"
            data-ocid="nav.link"
          >
            Home
          </Link>
          <Link
            to="/user"
            className="hover:text-foreground transition-colors"
            data-ocid="nav.user.link"
          >
            For Users
          </Link>
          <Link
            to="/company"
            className="hover:text-foreground transition-colors"
            data-ocid="nav.company.link"
          >
            For Companies
          </Link>
          <Link
            to="/intent"
            className="hover:text-foreground transition-colors"
            data-ocid="nav.intent.link"
          >
            What I Want to Buy
          </Link>
          <Link to="/admin" data-ocid="nav.admin.link">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Button>
          </Link>
        </nav>
        <div className="flex gap-2">
          <Link to="/user">
            <Button variant="ghost" size="sm" data-ocid="nav.user.button">
              Sign in
            </Button>
          </Link>
          <Link to="/company">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              data-ocid="nav.company.button"
            >
              Company Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary border-primary/20"
            >
              <Zap className="w-3 h-3 mr-1.5" /> The smarter way to manage your
              ad experience
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl md:text-7xl font-800 leading-[1.05] tracking-tight mb-6"
          >
            Ads that actually <span className="gradient-text">work</span> for
            you
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Stop seeing ads for things you'd never buy. AdsX lets you declare
            your real interests, protect your privacy, and only connect with
            brands you actually care about.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/user">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold shadow-glow"
                data-ocid="hero.user.primary_button"
              >
                I'm a User — Take Control
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/company">
              <Button
                size="lg"
                variant="outline"
                className="border-border/60 hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-base"
                data-ocid="hero.company.secondary_button"
              >
                I'm a Company — Find Audience
                <BarChart3 className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/intent">
              <Button
                size="lg"
                variant="outline"
                className="border-border/60 hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-base"
                data-ocid="hero.intent.secondary_button"
              >
                Tell Us What You Want to Buy
                <ShoppingBag className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-20 relative rounded-2xl overflow-hidden border border-border/40"
          style={{ boxShadow: "0 40px 80px -20px oklch(0.65 0.22 255 / 0.2)" }}
        >
          <img
            src="/assets/generated/hero-bg.dim_1600x900.jpg"
            alt="AdsX Platform"
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl px-5 py-3 text-center"
              >
                <div className="font-display text-2xl font-700 gradient-text">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* User Benefits */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl md:text-5xl font-700 mb-4">
            You deserve <span className="gradient-text">better ads</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three pillars that put you in the driver's seat of your digital ad
            experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {userBenefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card-glow bg-card rounded-2xl p-8"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 ${b.color}`}
              >
                <b.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-700 mb-3">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Company Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="bg-card rounded-3xl border border-border/60 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-10 md:p-14">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge
                  variant="secondary"
                  className="mb-4 bg-accent/10 text-accent border-accent/20"
                >
                  For Companies
                </Badge>
                <h2 className="font-display text-4xl font-700 mb-4 leading-tight">
                  Stop wasting spend on the wrong audience
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  AdsX connects you with users who've actively declared interest
                  in your category. No guessing, no wasted impressions — just
                  verified, consent-based audience data.
                </p>
                <ul className="space-y-3 mb-8">
                  {companyBenefits.map((cb) => (
                    <li
                      key={cb.text}
                      className="flex items-center gap-3 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{cb.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/company">
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="company.cta.primary_button"
                  >
                    Register Your Company
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-10 md:p-14 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4 w-full max-w-xs"
              >
                {[
                  "Technology",
                  "Fashion",
                  "Travel",
                  "Gaming",
                  "Finance",
                  "Health",
                ].map((cat, i) => (
                  <div
                    key={cat}
                    className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-3 text-center"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <Star className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="text-xs font-medium">{cat}</div>
                    <div className="text-xs text-muted-foreground">
                      {[234, 189, 312, 156, 278, 201][i]} users
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section
        data-ocid="founder.section"
        className="relative z-10 max-w-7xl mx-auto px-6 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card border border-border/60 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
            About the Founder
          </p>
          <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-5">
            <span className="font-display text-2xl font-700 text-primary">
              A
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-700 mb-1">
            Arish Singh
          </h2>
          <p className="text-sm text-primary font-medium mb-5">
            Founder &amp; Entrepreneur · 2026
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Arish Singh is an 18-year-old maverick entrepreneur with a bold
            vision to reshape how people experience online advertising. AdsX is
            his first step towards building a fairer, privacy-first digital ad
            ecosystem.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/adsx-logo-white.dim_400x120.png"
              alt="AdsX"
              className="h-6 w-auto"
            />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-xs text-muted-foreground">
              Founded by{" "}
              <span className="text-foreground font-medium">Arish Singh</span>
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <Link
              to="/admin"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground/80 transition-colors mt-1"
              data-ocid="footer.admin.link"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
