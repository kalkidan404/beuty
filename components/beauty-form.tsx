"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Sparkles, Flower2, Droplets, Heart, Target, Info, MessageSquare, Lightbulb } from "lucide-react"

const HAIR_TYPES = ["Straight", "Wavy", "Curly", "Coily", "Fine", "Thick"]
const SKIN_TYPES = ["Normal", "Oily", "Dry", "Combination", "Sensitive", "Mature"]
const CONDITIONS = [
  "Dandruff", "Frizz", "Hair loss", "Dry scalp",
  "Acne", "Dark spots", "Dullness", "Wrinkles",
  "Eczema", "Stretch marks", "Uneven tone", "Dehydration"
]
const GOALS = [
  "Deep hydration", "Shine & glow", "Hair growth",
  "Anti-aging", "Soothing & calming", "Brightening",
  "Strengthening", "Detox & purify", "Signature scent"
]

interface FormData {
  hairType: string
  skinType: string
  condition: string
  goal: string
  detailedCondition: string
  personalGoals: string
}

interface BeautyFormProps {
  onSubmit: (data: FormData) => void
  onBack: () => void
  isLoading: boolean
  error?: string | null
}

const steps = [
  { title: "Hair Type", subtitle: "What best describes your hair?", icon: Flower2, key: "hairType" as const, options: HAIR_TYPES, type: "select" },
  { title: "Skin Type", subtitle: "How would you describe your skin?", icon: Droplets, key: "skinType" as const, options: SKIN_TYPES, type: "select" },
  { title: "Condition", subtitle: "What would you like to address?", icon: Heart, key: "condition" as const, options: CONDITIONS, type: "select" },
  { title: "Goal", subtitle: "What's your beauty aspiration?", icon: Target, key: "goal" as const, options: GOALS, type: "select" },
  { title: "Tell Us More", subtitle: "Describe your specific condition in detail", icon: MessageSquare, key: "detailedCondition" as const, type: "textarea", placeholder: "Share more about your hair/skin concerns, how long you've had them, what you've tried, etc." },
  { title: "Your Goals", subtitle: "What are you hoping to achieve?", icon: Lightbulb, key: "personalGoals" as const, type: "textarea", placeholder: "Tell us about your beauty goals, what you want to feel or look like, any specific outcomes you're aiming for..." },
  { title: "Home Testing Tips", subtitle: "Learn how to check your skin & hair at home", icon: Info, type: "info", content: {
    skin: [
      "Wash your face and wait 30 minutes",
      "Check your T-zone (forehead, nose, chin) - if oily, you may have combination/oily skin",
      "Check cheeks - if tight/dry, you may have dry skin",
      "Look for redness or sensitivity reactions"
    ],
    hair: [
      "Check hair thickness by wrapping around finger - if you can see scalp easily, hair may be fine",
      "Test porosity by placing a strand in water - if it sinks quickly, high porosity; floats, low porosity",
      "Observe curl pattern and bounce - straight, wavy, curly, or coily",
      "Check for dryness by running fingers through - if rough/catchy, may need moisture"
    ]
  }}
]

export function BeautyForm({ onSubmit, onBack, isLoading, error }: BeautyFormProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    hairType: "",
    skinType: "",
    condition: "",
    goal: "",
    detailedCondition: "",
    personalGoals: "",
  })

  const currentStep = steps[step]
  const currentValue = (currentStep.type === "select" && currentStep.key) ? formData[currentStep.key] : ""

  function handleSelect(value: string) {
    if (currentStep.key) {
      setFormData(prev => ({ ...prev, [currentStep.key]: value }))
    }
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onSubmit(formData)
    }
  }

  function handlePrev() {
    if (step > 0) {
      setStep(step - 1)
    } else {
      onBack()
    }
  }

  const Icon = currentStep.icon

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-sans transition-all duration-500 ${
                  i <= step
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 h-px transition-all duration-500 ${
                    i < step ? "bg-foreground" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center">
              <Icon className="w-6 h-6 text-accent" />
            </div>

            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2 text-balance">
                {currentStep.title}
              </h2>
              <p className="text-muted-foreground font-sans">
                {currentStep.subtitle}
              </p>
            </div>

            {currentStep.type === "select" && currentStep.options && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                {currentStep.options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option)}
                    className={`px-5 py-4 rounded-xl text-sm font-sans transition-all duration-300 border ${
                      currentValue === option
                        ? "bg-foreground text-background border-foreground shadow-lg"
                        : "bg-card text-foreground border-border hover:border-accent/50 hover:bg-card/80"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {currentStep.type === "textarea" && currentStep.key && (
              <div className="w-full max-w-lg">
                <textarea
                  value={formData[currentStep.key] || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, [currentStep.key!]: e.target.value }))}
                  placeholder={currentStep.placeholder || ""}
                  className="w-full h-32 p-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground font-sans text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {(formData[currentStep.key] || "").length}/500
                </p>
              </div>
            )}

            {currentStep.type === "info" && currentStep.content && (
              <div className="w-full max-w-lg space-y-6">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-lg font-serif text-foreground mb-4 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-accent" />
                    Skin Testing at Home
                  </h3>
                  <ul className="space-y-2">
                    {currentStep.content.skin.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-medium mt-0.5">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-lg font-serif text-foreground mb-4 flex items-center gap-2">
                    <Flower2 className="w-5 h-5 text-accent" />
                    Hair Testing at Home
                  </h3>
                  <ul className="space-y-2">
                    {currentStep.content.hair.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-medium mt-0.5">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-sm text-destructive text-center font-sans"
          >
            {error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={
              (currentStep.type === "select" && !currentValue) ||
              isLoading
            }
            className="flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-full text-sm font-sans uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Crafting...
              </>
            ) : step === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Create Recipe
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
