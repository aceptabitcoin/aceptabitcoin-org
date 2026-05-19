'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Trend direction types for financial data display
 */
type TrendDirection = 'bullish' | 'bearish' | 'neutral';

/**
 * Color configuration for trend indicators
 * WCAG AA compliant color mappings
 */
const TREND_STYLES: Record<TrendDirection, {
  color: string;
  glow: string;
  label: string;
  ariaLabel: string;
}> = {
  bullish: {
    color: 'var(--matrix)',
    glow: 'var(--matrix-glow)',
    label: '↑ Bullish',
    ariaLabel: 'Tendencia alcista',
  },
  bearish: {
    color: 'var(--orange-500)',
    glow: 'var(--orange-glow)',
    label: '↓ Bearish',
    ariaLabel: 'Tendencia bajista',
  },
  neutral: {
    color: '#94a3b8',
    glow: '0 0 10px rgba(148, 163, 174, 0.2)',
    label: '→ Neutral',
    ariaLabel: 'Tendencia neutral',
  },
} as const;

/**
 * Live indicator configuration
 */
const LIVE_CONFIG = {
  dotColor: 'var(--matrix)',
  pulseColor: 'rgba(0, 255, 65, 0.4)',
  label: 'LIVE',
} as const;

/**
 * AhorraSectionHeader Props
 * 
 * @example
 * // Basic usage
 * <AhorraSectionHeader 
 *   title="Ahorra en Bitcoin" 
 *   subtitle="DCA semanal automatizado"
 *   marketTrend="bullish"
 *   isLive
 * />
 * 
 * @example
 * // With context chip
 * <AhorraSectionHeader
 *   title="Portfolio"
 *   contextValue="+12.4% este mes"
 *   marketTrend="bullish"
 * />
 */
export interface AhorraSectionHeaderProps {
  /** Main heading text (e.g., "Ahorra") */
  title: string;

  /** Supporting subtitle with additional context */
  subtitle?: string;

  /** Trend direction for financial context indicator */
  marketTrend?: TrendDirection;

  /** Display live status indicator badge */
  isLive?: boolean;

  /** Optional context value displayed in chip (e.g., "+12.4%") */
  contextValue?: string;

  /** Additional CSS classes for the container */
  className?: string;

  /** HTML ID for anchor navigation */
  id?: string;
}

/**
 * LiveBadge - Memoized live status indicator
 * WCAG AA compliant with proper ARIA attributes
 */
const LiveBadge = React.memo(() => (
  <motion.span
    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
    style={{
      backgroundColor: 'rgba(0, 255, 65, 0.1)',
      color: LIVE_CONFIG.dotColor,
      border: '1px solid rgba(0, 255, 65, 0.3)',
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    role="status"
    aria-label="Datos en vivo"
  >
    <motion.span
      className="w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: LIVE_CONFIG.dotColor }}
      animate={{
        boxShadow: [
          `0 0 0 0 ${LIVE_CONFIG.pulseColor}`,
          `0 0 0 4px transparent`,
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
    {LIVE_CONFIG.label}
  </motion.span>
));

LiveBadge.displayName = 'LiveBadge';

/**
 * TrendChip - Memoized trend indicator with accessibility
 */
interface TrendChipProps {
  trend: TrendDirection;
}

const TrendChip = React.memo(({ trend }: TrendChipProps) => {
  const styles = TREND_STYLES[trend];

  return (
    <motion.span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium"
      style={{
        backgroundColor: `${styles.color}10`,
        borderColor: `${styles.color}40`,
        color: styles.color,
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 25 }}
      role="status"
      aria-label={styles.ariaLabel}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: styles.color,
          boxShadow: styles.glow,
        }}
      />
      {styles.label}
    </motion.span>
  );
});

TrendChip.displayName = 'TrendChip';

/**
 * ContextChip - Optional context value display
 */
interface ContextChipProps {
  value: string;
}

const ContextChip = React.memo(({ value }: ContextChipProps) => (
  <motion.span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
    style={{
      backgroundColor: 'rgba(148, 163, 174, 0.1)',
      borderColor: 'rgba(148, 163, 174, 0.3)',
      color: '#94a3b8',
    }}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.1 }}
  >
    {value}
  </motion.span>
));

ContextChip.displayName = 'ContextChip';

/**
 * DivisorLine - Optimized divider with mesh gradient effect
 */
interface DivisorLineProps {
  color: string;
  glow: string;
  delay?: number;
}

const DivisorLine = React.memo(({ color, glow, delay = 0 }: DivisorLineProps) => (
  <motion.div
    className="w-full h-px relative overflow-hidden"
    style={{
      backgroundImage: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
      boxShadow: glow,
    }}
    initial={{ opacity: 0, scaleX: 0.95 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ type: 'spring', stiffness: 120, damping: 30, delay }}
  />
));

DivisorLine.displayName = 'DivisorLine';

/**
 * AhorraSectionHeader - Premium fintech dashboard section header
 * 
 * A production-ready component following DS v2.1 standards with:
 * - Spring-based micro-interactions for tactile feel
 * - WCAG AA compliant color contrasts
 * - Memoized sub-components for performance
 * - Framer-motion whileInView for optimized scroll animations
 * 
 * @remarks
 * Uses CSS variables for theming: `--matrix`, `--orange-500`, `--orange-glow`
 * Pre-defined in `app/globals.css` for maintainability.
 */
export default function AhorraSectionHeader({
  title,
  subtitle,
  marketTrend = 'neutral',
  isLive = false,
  contextValue,
  className,
  id,
}: AhorraSectionHeaderProps) {
  // Memoize computed styles to prevent unnecessary recalculations
  const trendStyles = useMemo(() => TREND_STYLES[marketTrend], [marketTrend]);

  // Fallback for missing title (should not happen in production)
  const safeTitle = title || 'Sección';

  return (
    <section
      id={id}
      className={cn(
        'relative w-full py-8 sm:py-10 border-y border-white/5',
        className
      )}
      role="region"
      aria-label={`Sección: ${safeTitle}`}
    >
      {/* Top divider with mesh gradient */}
      <DivisorLine
        color={trendStyles.color}
        glow={trendStyles.glow}
        delay={0}
      />

      {/* Main content container */}
      <motion.div
        className="relative flex flex-col items-center mt-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 30,
        }}
      >
        {/* Title with premium typography */}
        <motion.h2
          className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-none"
          style={{
            color: trendStyles.color,
            textShadow: `0 0 16px ${trendStyles.glow.includes('rgba') ? trendStyles.glow.split(')')[0] + ', 0.3)' : trendStyles.color + '60'}`,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 120, damping: 25, delay: 0.05 }}
        >
          {safeTitle}
        </motion.h2>

        {/* Subtitle with refined typography */}
        {subtitle && (
          <motion.p
            className="mt-3 text-sm sm:text-base font-mono tracking-wide text-gray-400 max-w-md text-center"
            style={{ lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 140, damping: 25, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Badges row */}
        <motion.div
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 160, damping: 25, delay: 0.15 }}
        >
          {isLive && <LiveBadge />}
          <TrendChip trend={marketTrend} />
          {contextValue && <ContextChip value={contextValue} />}
        </motion.div>
      </motion.div>

      {/* Bottom divider */}
      <DivisorLine
        color={trendStyles.color}
        glow={trendStyles.glow}
        delay={0.2}
      />
    </section>
  );
}