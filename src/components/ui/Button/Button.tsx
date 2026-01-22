import React, { useState, useRef } from 'react'
import { Icon, IconName } from '../Icon'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger-primary' | 'danger-tertiary'
export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonState = 'enabled' | 'hover' | 'active' | 'focus' | 'disabled' | 'skeleton'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante do botão
   * - primary: Brand fill
   * - secondary: Neutral scale
   * - tertiary: Ghost/Outline (stroke apenas)
   * - danger-primary: Fill vermelho
   * - danger-tertiary: Outline vermelho
   */
  variant?: ButtonVariant
  /**
   * Tamanho do botão
   */
  size?: ButtonSize
  /**
   * Ícone a ser exibido antes do texto (opcional)
   */
  icon?: IconName
  /**
   * Se true, renderiza apenas o ícone (sem texto)
   */
  iconOnly?: boolean
  /**
   * Se true, aplica largura total
   */
  fullWidth?: boolean
  /**
   * Se true, mostra estado de loading (skeleton)
   */
  loading?: boolean
  /**
   * Conteúdo do botão
   */
  children?: React.ReactNode
}

/**
 * Componente Button padronizado do MoWi Design System
 * 
 * Implementa 5 variantes com estados bem definidos e micro-interações fluidas.
 * Usa exclusivamente tokens semânticos existentes.
 */
export function Button({
  variant = 'primary',
  size = 'medium',
  icon,
  iconOnly = false,
  fullWidth = false,
  loading = false,
  disabled: externalDisabled,
  children,
  className = '',
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  ...props
}: ButtonProps) {
  const [internalState, setInternalState] = useState<ButtonState>('enabled')
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Determinar estado real
  const actualDisabled = externalDisabled || loading
  const actualState: ButtonState = actualDisabled
    ? loading
      ? 'skeleton'
      : 'disabled'
    : internalState

  // Obter estilos base da variante (usando apenas tokens semânticos)
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'var(--color-background-action-primary)',
          bgHover: 'var(--color-background-action-primary-hover)',
          text: 'var(--color-text-action-primary)',
          border: 'transparent',
          borderHover: 'transparent',
        }
      case 'secondary':
        return {
          bg: 'var(--color-background-action-secondary)',
          bgHover: 'var(--color-background-tertiary)',
          text: 'var(--color-text-secondary)',
          border: 'var(--color-border-default)',
          borderHover: 'var(--color-border-hover)',
        }
      case 'tertiary':
        return {
          bg: 'transparent',
          bgHover: 'var(--color-background-tertiary)',
          text: 'var(--color-text-action-link)',
          border: 'var(--color-brand-500)',
          borderHover: 'var(--color-brand-500)',
        }
      case 'danger-primary':
        return {
          bg: 'var(--color-red-600)',
          bgHover: 'var(--color-red-700)',
          text: 'var(--color-text-on-dark)',
          border: 'transparent',
          borderHover: 'transparent',
        }
      case 'danger-tertiary':
        return {
          bg: 'transparent',
          bgHover: 'var(--color-red-100)',
          text: 'var(--color-text-error)',
          border: 'var(--color-border-input-error)',
          borderHover: 'var(--color-border-input-error)',
        }
    }
  }

  const variantStyles = getVariantStyles()

  // Obter tamanhos
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 'var(--size-button-height-small)',
          padding: iconOnly ? 'var(--space-padding-icon)' : 'var(--space-padding-button-small)',
          fontSize: 'var(--font-size-button-small)',
          iconSize: 16, // --size-icon-small
        }
      case 'medium':
        return {
          height: 'var(--size-button-height-medium)',
          padding: iconOnly ? 'var(--space-padding-icon)' : 'var(--space-padding-button-medium)',
          fontSize: 'var(--font-size-button-medium)',
          iconSize: 20, // --size-icon-medium
        }
      case 'large':
        return {
          height: 'var(--size-button-height-large)',
          padding: iconOnly ? 'var(--space-padding-icon)' : 'var(--space-padding-button-large)',
          fontSize: 'var(--font-size-button-large)',
          iconSize: 20, // --size-icon-medium
        }
    }
  }

  const sizeStyles = getSizeStyles()

  // Obter estilos do estado atual
  const getStateStyles = (): React.CSSProperties => {
    // Verificar se há backgroundColor customizado no style prop
    const customBackgroundColor = style?.backgroundColor
    
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: iconOnly ? '0' : 'var(--space-gap-element)',
      width: fullWidth ? '100%' : iconOnly ? sizeStyles.height : 'auto',
      height: sizeStyles.height,
      minWidth: iconOnly ? sizeStyles.height : undefined,
      padding: sizeStyles.padding,
      borderRadius: 'var(--shape-radius-button)',
      fontSize: sizeStyles.fontSize,
      fontWeight: 'var(--font-weight-bold)',
      lineHeight: 'var(--font-line-height-default)',
      borderWidth: '1px',
      borderStyle: 'solid',
      outline: 'none',
      userSelect: 'none',
      ...style,
    }

    switch (actualState) {
      case 'enabled':
        return {
          ...baseStyles,
          backgroundColor: customBackgroundColor || variantStyles.bg,
          color: variantStyles.text,
          borderColor: variantStyles.border,
          opacity: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: 'scale(1)',
          boxShadow: 'none',
        }
      case 'hover':
        return {
          ...baseStyles,
          backgroundColor: customBackgroundColor || variantStyles.bgHover,
          color: variantStyles.text,
          borderColor: variantStyles.borderHover,
          opacity: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: 'scale(1)',
          boxShadow: 'none',
        }
      case 'active':
        return {
          ...baseStyles,
          backgroundColor: customBackgroundColor || variantStyles.bgHover,
          color: variantStyles.text,
          borderColor: variantStyles.borderHover,
          opacity: 1,
          cursor: 'pointer',
          transition: 'all 0.1s ease-in',
          transform: 'scale(0.98)',
          boxShadow: 'none',
        }
      case 'focus':
        return {
          ...baseStyles,
          backgroundColor: customBackgroundColor || variantStyles.bg,
          color: variantStyles.text,
          borderColor: variantStyles.border,
          opacity: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: 'scale(1)',
          // Estilos de foco serão aplicados via CSS :focus-visible
        }
      case 'disabled':
        return {
          ...baseStyles,
          backgroundColor: customBackgroundColor || variantStyles.bg,
          color: variantStyles.text,
          borderColor: variantStyles.border,
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none',
          transition: 'all 0.2s ease-in-out',
          transform: 'scale(1)',
          boxShadow: 'none',
        }
      case 'skeleton':
        return {
          ...baseStyles,
          background: `linear-gradient(
            90deg,
            var(--color-background-secondary),
            var(--color-background-tertiary),
            var(--color-background-secondary)
          )`,
          backgroundSize: '200% 100%',
          color: 'transparent',
          borderColor: 'transparent',
          opacity: 1,
          cursor: 'wait',
          pointerEvents: 'none',
          transition: 'none',
          transform: 'scale(1)',
          boxShadow: 'none',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        }
    }
  }

  // Handlers para estados interativos
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!actualDisabled && (internalState === 'enabled' || internalState === 'focus')) {
      setInternalState('hover')
    }
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!actualDisabled) {
      const isFocused = document.activeElement === buttonRef.current
      if (isFocused) {
        setInternalState('focus')
      } else {
        setInternalState('enabled')
      }
    }
    onMouseLeave?.(e)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!actualDisabled && (internalState === 'hover' || internalState === 'focus')) {
      setInternalState('active')
    }
    onMouseDown?.(e)
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!actualDisabled) {
      const isMouseOver = e.currentTarget.matches(':hover')
      if (isMouseOver) {
        setInternalState('hover')
      } else {
        const isFocused = document.activeElement === buttonRef.current
        setInternalState(isFocused ? 'focus' : 'enabled')
      }
    }
    onMouseUp?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    // O CSS :focus-visible será responsável pelo estilo visual
    // Não precisamos mudar o estado interno para foco, apenas manter hover/enabled
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!actualDisabled) {
      setInternalState('enabled')
    }
    onBlur?.(e)
  }

  const stateStyles = getStateStyles()

  return (
    <>
      {/* Keyframes para skeleton animation */}
      <style>
        {`
          @keyframes skeleton-pulse {
            0%, 100% { background-position: 200% 0; }
            50% { background-position: 0 0; }
          }
        `}
      </style>
      <button
        {...props}
        ref={buttonRef}
        disabled={actualDisabled}
        className={`flex items-center justify-center button-focus-visible ${className}`}
        style={stateStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {icon && (
          <Icon
            name={icon}
            size={sizeStyles.iconSize}
            color={actualState === 'skeleton' ? 'transparent' : variantStyles.text}
          />
        )}
        {!iconOnly && children && (
          <span style={{ color: actualState === 'skeleton' ? 'transparent' : 'inherit' }}>
            {children}
          </span>
        )}
      </button>
    </>
  )
}
