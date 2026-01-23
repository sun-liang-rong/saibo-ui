// Theme type definitions for Cyberpunk UI system

export type Theme = 'dark' | 'light'

export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error'

export interface ThemeColors {
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  background: string
  surface: string
  border: string
}

export interface ButtonVariant {
  filled: boolean
  outlined: boolean
  ghost: boolean
  iconOnly: boolean
}

export interface InputVariant {
  standard: boolean
  search: boolean
  password: boolean
  textarea: boolean
}

export interface Status {
  online: boolean
  offline: boolean
  active: boolean
  inactive: boolean
  warning: boolean
  critical: boolean
}

export type Size = 'sm' | 'md' | 'lg' | 'xl'

export type SizeInput = 'sm' | 'md' | 'lg'
