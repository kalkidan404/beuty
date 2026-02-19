"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-24 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-sans">
            AI-Powered Beauty Rituals
          </span>
          <div className="w-12 h-px bg-accent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif text-foreground leading-tight text-balance"
        >
          Your Personalized Natural Beauty Ritual
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-sans"
        >
          Discover bespoke, handcrafted recipes for hair, body, and scent
          — formulated by AI, inspired by nature, designed for you.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="flex items-center gap-3 px-10 py-4 bg-foreground text-background rounded-full font-sans text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Create My Ritual
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center gap-6 mt-4 text-xs uppercase tracking-widest text-muted-foreground"
        >
          <span>Natural</span>
          <div className="w-1 h-1 rounded-full bg-accent" />
          <span>Safe</span>
          <div className="w-1 h-1 rounded-full bg-accent" />
          <span>Personalized</span>
        </motion.div>
      </div>
    </section>
  )
}
