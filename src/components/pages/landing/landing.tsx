"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Brain,
  Zap,
  Network,
  Eye,
  Search,
  BookOpen,
  Target,
  BarChart3,
  ArrowRight,
  Sparkles,
  Play,
} from "lucide-react";
import Logo from "@/components/logo";
import useAppState from "@/store/useAppState";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 },
};

export default function Landing() {
  const { user } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo showText size="md" />
          <div className="flex items-center gap-4">
            {!user && (
              <>
                <Link href="/pricing">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-white/10"
                  >
                    Pricing
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              <Badge
                variant="secondary"
                className="bg-blue-600/20 text-blue-300 border-blue-600/30 px-4 py-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Learning Platform
              </Badge>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Build Lasting Knowledge
              <br />
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                Learn & Explore
              </motion.span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Master any subject with AI-generated flashcards and visualize
              knowledge connections through interactive mind maps. Your complete
              intelligent knowledge building ecosystem.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
                >
                  Start Learning Free
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 px-8 py-6 text-lg group"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              className={`absolute w-4 h-4 bg-blue-500/20 rounded-full blur-sm`}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Apps Section */}
      <section className="px-6 py-20 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Two Powerful Apps, One Platform
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-2xl mx-auto"
            >
              Choose your learning style or use both together for maximum impact
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Flashcard Studio */}
            <motion.div
              variants={scaleIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-600/30 backdrop-blur-sm h-full">
                <CardHeader className="text-center pb-8">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mx-auto mb-4 p-4 bg-purple-600/20 rounded-2xl w-fit"
                  >
                    <BookOpen className="w-12 h-12 text-purple-400" />
                  </motion.div>
                  <CardTitle className="text-3xl font-bold text-white">
                    Flashcard Studio
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-300">
                    Master any subject with AI-generated flashcards and spaced
                    repetition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Brain className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          AI-powered card generation
                        </h4>
                        <p className="text-sm text-slate-400">
                          Instantly create flashcards from any topic
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Target className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          Intelligent spaced repetition
                        </h4>
                        <p className="text-sm text-slate-400">
                          Review cards when you need to remember them
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          Progress tracking & analytics
                        </h4>
                        <p className="text-sm text-slate-400">
                          Monitor your learning journey and insights
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <Link href="/collections">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Try Flashcard Studio
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Graph Explorer */}
            <motion.div
              variants={scaleIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-600/30 backdrop-blur-sm h-full">
                <CardHeader className="text-center pb-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mx-auto mb-4 p-4 bg-blue-600/20 rounded-2xl w-fit"
                  >
                    <Network className="w-12 h-12 text-blue-400" />
                  </motion.div>
                  <CardTitle className="text-3xl font-bold text-white">
                    Graph Explorer
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-300">
                    Visualize knowledge connections with interactive mind maps
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          AI keyword generation
                        </h4>
                        <p className="text-sm text-slate-400">
                          Discover related topics and concepts
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <Eye className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          Interactive graph visualization
                        </h4>
                        <p className="text-sm text-slate-400">
                          Explore connections through beautiful graphs
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <Search className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          Google search integration
                        </h4>
                        <p className="text-sm text-slate-400">
                          Research topics with integrated search
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <Link href="/canvas">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Try Graph Explorer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-600/30 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of learners using MindGraph to master new subjects
              faster and more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <>
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg"
                    >
                      Start Learning Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-blue-600 hover:bg-white/10 px-12 py-6 text-lg"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <Logo showText size="sm" className="mx-auto mb-4" />
          <p className="text-slate-400">
            © 2025 MindGraph. Intelligent learning platform powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
