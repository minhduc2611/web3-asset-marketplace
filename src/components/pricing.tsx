"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { 
  Check, 
  Zap, 
  Crown, 
  Gem, 
  ArrowLeft, 
  Star,
  Users,
  BookOpen,
  Network,
  Mail,
  MessageCircle,
  Video,
  Award,
  Sparkles
} from "lucide-react";
import Logo from "@/components/logo";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const plans = [
  {
    name: "Starter",
    icon: Zap,
    color: "blue",
    gradient: "from-blue-600 to-blue-700",
    bgGradient: "from-blue-900/40 to-blue-800/40",
    borderColor: "border-blue-600/30",
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    freeFeatures: [
      "2 canvases (max 70 nodes each)",
      "2 flashcard collections (up to 50 cards each)"
    ],
    premiumFeatures: []
  },
  {
    name: "Premium",
    icon: Crown,
    color: "purple",
    gradient: "from-purple-600 to-purple-700",
    bgGradient: "from-purple-900/40 to-purple-800/40",
    borderColor: "border-purple-600/30",
    monthlyPrice: 9.99,
    yearlyPrice: 99,
    popular: true,
    freeFeatures: [
      "All Starter features included"
    ],
    premiumFeatures: [
      "10 canvases (100 nodes each)",
      "10 flashcard collections (150 cards each)",
      "Access to all online course modules",
      "Email support"
    ]
  },
  {
    name: "Diamond",
    icon: Gem,
    color: "amber",
    gradient: "from-amber-600 to-amber-700",
    bgGradient: "from-amber-900/40 to-amber-800/40",
    borderColor: "border-amber-600/30",
    monthlyPrice: 24.99,
    yearlyPrice: 249,
    popular: false,
    freeFeatures: [
      "All Premium features included"
    ],
    premiumFeatures: [
      "Unlimited canvases & flashcard collections",
      "Early access to new courses & beta features",
      "Priority support (chat/video)",
      "Exclusive webinars & certificates"
    ]
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("canvas")) return Network;
    if (feature.includes("flashcard")) return BookOpen;
    if (feature.includes("course")) return Award;
    if (feature.includes("support")) return feature.includes("chat") || feature.includes("video") ? Video : Mail;
    if (feature.includes("webinar")) return Users;
    if (feature.includes("beta")) return Star;
    return Check;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <Logo showText size="md" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-block"
            >
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Choose Your Learning Journey
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight"
            >
              Simple, Transparent Pricing
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-2xl mx-auto"
            >
              Start free and upgrade as you grow. No hidden fees, cancel anytime.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="px-6 pb-12"
      >
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-white' : 'text-slate-400'}`}>
                Yearly
              </span>
              {isYearly && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="ml-2"
                >
                  <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
                    Save 17%
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid lg:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const period = isYearly ? 'year' : 'month';
              
              return (
                <motion.div
                  key={plan.name}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 px-6 py-2">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </Badge>
                    </motion.div>
                  )}
                  
                  <Card className={`bg-gradient-to-br ${plan.bgGradient} ${plan.borderColor} backdrop-blur-sm h-full ${plan.popular ? 'ring-2 ring-purple-600/50' : ''}`}>
                    <CardHeader className="text-center pb-8">
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                        className={`mx-auto mb-4 p-4 bg-gradient-to-br ${plan.gradient} rounded-2xl w-fit`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                      <div className="space-y-2">
                        <div className="text-4xl font-bold text-white">
                          {price === 0 ? 'Free' : `€${price}`}
                          {price > 0 && (
                            <span className="text-lg font-normal text-slate-300">
                              /{period}
                            </span>
                          )}
                        </div>
                        {price > 0 && isYearly && (
                          <p className="text-sm text-slate-400">
                            €{(plan.monthlyPrice * 12).toFixed(0)} billed annually
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Free Features */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          {plan.name === "Starter" ? "Free Features" : "Included Features"}
                        </h4>
                        {plan.freeFeatures.map((feature, featureIndex) => (
                          <motion.div 
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * featureIndex }}
                            className="flex items-start gap-3"
                          >
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Premium Features */}
                      {plan.premiumFeatures.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-slate-700/50">
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-400" />
                            Premium Add-ons
                          </h4>
                          {plan.premiumFeatures.map((feature, featureIndex) => {
                            const FeatureIcon = getFeatureIcon(feature);
                            return (
                              <motion.div 
                                key={featureIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * (featureIndex + plan.freeFeatures.length) }}
                                className="flex items-start gap-3"
                              >
                                <FeatureIcon className={`w-4 h-4 text-${plan.color}-400 mt-0.5 flex-shrink-0`} />
                                <span className="text-sm text-slate-300">{feature}</span>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                      
                      <div className="pt-6">
                        <Link href={plan.name === "Starter" ? "/canvas" : `/checkout?plan=${plan.name.toLowerCase()}&yearly=${isYearly}`}>
                          <Button 
                            className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-medium py-6`}
                          >
                            {plan.name === "Starter" ? "Get Started Free" : `Choose ${plan.name}`}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-white">Have Questions?</h2>
            <p className="text-xl text-slate-300">
              We&apos;re here to help you choose the perfect plan for your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}