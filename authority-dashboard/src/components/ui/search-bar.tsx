"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Search, CircleDot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"


const GooeyFilter = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id="gooey-effect">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
)

interface TouristData {
  id: string;
  digital_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  nationality: string;
  contacts: {
    phone_primary: string;
    email: string;
  };
  documents: {
    passport_number: string;
  };
}

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  tourists?: TouristData[]
}

const SearchBar = ({ placeholder = "Search tourists...", onSearch, tourists = [] }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{display: string, searchTerm: string, tourist: TouristData}>>([])
  const [isClicked, setIsClicked] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const isUnsupportedBrowser = useMemo(() => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent.toLowerCase()
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")
    const isChromeOniOS = ua.includes("crios")
    return isSafari || isChromeOniOS
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.trim()) {
      // Generate suggestions from tourist data
      const touristSuggestions = tourists
        .filter(tourist => 
          tourist.full_name.toLowerCase().includes(value.toLowerCase()) ||
          tourist.digital_id.toLowerCase().includes(value.toLowerCase()) ||
          tourist.documents.passport_number.toLowerCase().includes(value.toLowerCase()) ||
          tourist.contacts.phone_primary.includes(value) ||
          tourist.contacts.email.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 6) // Limit to 6 suggestions
        .map(tourist => ({
          display: `${tourist.full_name} - ID: ${tourist.digital_id}`,
          searchTerm: tourist.full_name,
          tourist: tourist
        }))
      
      setSuggestions(touristSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isFocused) {
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 800)
  }

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  const searchIconVariants = {
    initial: { scale: 1 },
    animate: {
      rotate: isAnimating ? [0, -15, 15, -10, 10, 0] : 0,
      scale: isAnimating ? [1, 1.3, 1] : 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  } as const

  const suggestionVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, delay: i * 0.05 },
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 15, delay: i * 0.07 },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: -5,
      scale: 0.9,
      transition: { duration: 0.1, delay: i * 0.03 },
    }),
  } as const

  const particles = Array.from({ length: isFocused ? 12 : 0 }, (_, i) => (
    <motion.div
      key={i}
      initial={{ scale: 0 }}
      animate={{
        x: [0, (Math.random() - 0.5) * 30],
        y: [0, (Math.random() - 0.5) * 30],
        scale: [0, Math.random() * 0.6 + 0.3],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: Math.random() * 1.2 + 1.2,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className="absolute w-2 h-2 rounded-full bg-primary/60"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        filter: "blur(1px)",
      }}
    />
  ))

  const clickParticles = isClicked
    ? Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`click-${i}`}
          initial={{ x: mousePosition.x, y: mousePosition.y, scale: 0, opacity: 1 }}
          animate={{
            x: mousePosition.x + (Math.random() - 0.5) * 120,
            y: mousePosition.y + (Math.random() - 0.5) * 120,
            scale: Math.random() * 0.6 + 0.2,
            opacity: [1, 0],
          }}
          transition={{ duration: Math.random() * 0.6 + 0.4, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full bg-primary/80"
          style={{
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.6)",
          }}
        />
      ))
    : null

  return (
    <div className="relative w-full">
      <GooeyFilter />
      <motion.form
        onSubmit={handleSubmit}
        className="relative flex items-center justify-center w-full mx-auto"
        initial={{ width: "600px" }}
        animate={{ width: isFocused ? "800px" : "600px", scale: isFocused ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className={cn(
            "flex items-center w-full rounded-lg border relative overflow-hidden bg-background",
            isFocused ? "border-ring shadow-sm shadow-black/5" : "border-input shadow-sm shadow-black/5"
          )}
          animate={{
            boxShadow: isClicked
              ? "0 0 20px rgba(139, 92, 246, 0.3), 0 0 8px rgba(236, 72, 153, 0.4) inset"
              : isFocused
              ? "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(139, 92, 246, 0.2)"
              : "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
          onClick={handleClick}
        >
          {isFocused && (
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.05,
                background: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}

          <div
            className="absolute inset-0 overflow-hidden rounded-lg -z-5"
            style={{ filter: isUnsupportedBrowser ? "none" : "url(#gooey-effect)" }}
          >
            {particles}
          </div>

          {isClicked && (
            <>
              <motion.div
                className="absolute inset-0 -z-5 rounded-lg bg-primary/10"
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 -z-5 rounded-lg bg-background/50"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </>
          )}

          {clickParticles}

          <motion.div className="pl-3 py-2" variants={searchIconVariants} initial="initial" animate="animate">
            <Search
              size={18}
              strokeWidth={isFocused ? 2.5 : 2}
              className={cn(
                "transition-all duration-300",
                isAnimating ? "text-primary" : isFocused ? "text-primary" : "text-muted-foreground",
              )}
            />
          </motion.div>

          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={cn(
              "w-full py-2 bg-transparent outline-none placeholder:text-muted-foreground/70 text-sm text-foreground relative z-10",
              isFocused ? "tracking-wide" : ""
            )}
          />

          <AnimatePresence>
            {searchQuery && (
              <motion.button
                type="submit"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 mr-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90 transition-all"
              >
                Search
              </motion.button>
            )}
          </AnimatePresence>

          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.05, 0.1, 0.05, 0],
                background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 70%)",
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            />
          )}
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-2 overflow-hidden bg-background/95 backdrop-blur-md rounded-lg shadow-sm shadow-black/5 border border-border"
            style={{
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.tourist.id}
                  custom={index}
                  variants={suggestionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => {
                    setSearchQuery(suggestion.searchTerm)
                    if (onSearch) onSearch(suggestion.searchTerm)
                    setIsFocused(false)
                  }}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground group"
                >
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: index * 0.06 }}>
                    <CircleDot size={14} className="text-muted-foreground group-hover:text-primary" />
                  </motion.div>
                  <motion.div
                    className="flex-1"
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <div className="text-sm text-foreground group-hover:text-primary font-medium">
                      {suggestion.tourist.full_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {suggestion.tourist.digital_id} <span className="mx-1">•</span> {suggestion.tourist.nationality}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { SearchBar }
