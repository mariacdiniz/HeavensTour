import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

interface MotionCardProps extends HTMLMotionProps<'div'> {
  delay?: number
}

/** Entrada suave — sem hover exagerado */
export function MotionCard({
  className,
  children,
  delay = 0,
  ...props
}: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease }}
      className={cn('glass-panel', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionSection({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export function MotionFade({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
