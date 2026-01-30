import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../../ui/Avatar'
import { Icon } from '../../ui/Icon'
import { NAVIGATION_ITEMS } from '../../../constants'
import type { IconName } from '../../ui/Icon'

interface HeaderMobileProps {
  userName?: string
  userEmail?: string
  userAvatar?: string | null
}

export function HeaderMobile({
  userName = 'Moises Wilson',
  userEmail = 'MoWill_95@gmail.com',
  userAvatar = null,
}: HeaderMobileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    handleCloseMenu()
  }

  const handleLogout = () => {
    // TODO: Implementar lógica de logout
    console.log('Logout')
    handleCloseMenu()
    setIsLogoutConfirmOpen(false)
  }

  const handleAvatarClick = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen)
  }

  const handleCloseAvatarMenu = () => {
    setIsAvatarMenuOpen(false)
  }

  const handleNavigateToProfile = () => {
    navigate('/profile')
    handleCloseAvatarMenu()
  }

  const handleNavigateToSettings = () => {
    navigate('/profile')
    // Mudar para aba de configurações se necessário
    handleCloseAvatarMenu()
  }

  const handleLogoutClick = () => {
    handleCloseAvatarMenu()
    setIsLogoutConfirmOpen(true)
  }

  return (
    <>
      {/* Header Mobile - apenas mobile/tablet (<1280px) */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: 'var(--space-header-height)',
          backgroundColor: 'var(--color-background-surface)',
          borderBottomColor: 'var(--color-border-default)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          paddingLeft: 'var(--space-layout-component)',
          paddingRight: 'var(--space-layout-component)',
          boxShadow: 'var(--shadow-elevation-1)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center"
          style={{
            height: 'var(--size-40)',
          }}
        >
          <svg
            width="120"
            height="40"
            viewBox="0 0 275 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', width: '80px', height: 'auto' }}
          >
            <path
              d="M257.284 12.6493L260.369 0H274.04L270.96 12.6493H257.284ZM242.986 71.3226L255.501 19.6551H269.172L256.657 71.3226H242.986Z"
              fill="#0023AF"
            />
            <path
              d="M170.176 71.3226L153.148 0H167.89L178.642 48.9917L191.68 0H208.805L221.309 49.8188L232.255 0H246.753L229.433 71.3226H214.157L199.951 18.0009L185.793 71.3226H170.176Z"
              fill="#0023AF"
            />
            <path
              d="M97.6738 44.7591C97.6738 40.2183 98.7928 35.8235 101.031 31.5746C103.269 27.3257 106.431 24.0823 110.518 21.8444C114.637 19.6064 119.226 18.4874 124.286 18.4874C132.103 18.4874 138.508 21.0335 143.503 26.1257C148.498 31.1854 150.996 37.5911 150.996 45.3429C150.996 53.1595 148.466 59.6463 143.406 64.8033C138.379 69.9279 132.038 72.4902 124.383 72.4902C119.648 72.4902 115.123 71.4199 110.81 69.2792C106.528 67.1386 103.269 64.0087 101.031 59.8896C98.7928 55.738 97.6738 50.6945 97.6738 44.7591ZM111.685 45.4888C111.685 50.6134 112.902 54.5379 115.334 57.2624C117.767 59.9869 120.767 61.3491 124.335 61.3491C127.902 61.3491 130.886 59.9869 133.286 57.2624C135.719 54.5379 136.935 50.581 136.935 45.3915C136.935 40.3318 135.719 36.4397 133.286 33.7152C130.886 30.9908 127.902 29.6285 124.335 29.6285C120.767 29.6285 117.767 30.9908 115.334 33.7152C112.902 36.4397 111.685 40.3642 111.685 45.4888Z"
              fill="#0023AF"
            />
            <path
              d="M76.5776 0.00222629L93.6055 71.3248L78.8642 71.3248L68.1123 22.3331L55.0737 71.3248L37.9485 71.3248L25.4452 21.506L14.4987 71.3248L0.00062561 71.3248L17.3204 0.00222111L32.5969 0.00222245L46.8031 53.3239L60.9605 0.00222493L76.5776 0.00222629Z"
              fill="#0023AF"
            />
          </svg>
        </div>

        {/* Grupo de botões à direita */}
        <div className="flex items-center" style={{ gap: '8px' }}>
          {/* Botão de menu (três pontos) */}
          <button
            onClick={handleMenuToggle}
            className="flex items-center justify-center focus:outline-none transition-colors duration-200"
            style={{
              width: 'var(--size-button-height-medium)',
              height: 'var(--size-button-height-medium)',
              borderRadius: '40px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
          >
            <Icon name="menu" size={20} color="var(--color-text-primary)" />
          </button>

          {/* Avatar clicável - abre menu dropdown */}
          <div className="relative">
            <button
              onClick={handleAvatarClick}
              className="flex items-center justify-center focus:outline-none transition-opacity duration-200"
              style={{
                width: 'var(--size-button-height-medium)',
                height: 'var(--size-button-height-medium)',
                borderRadius: '50%',
                padding: '0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
              aria-label="Menu do usuário"
              aria-expanded={isAvatarMenuOpen}
            >
              <Avatar src={userAvatar} alt={userName} size="sm" />
            </button>

            {/* Dropdown do Avatar */}
            {isAvatarMenuOpen && (
              <>
                {/* Overlay para fechar ao clicar fora */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={handleCloseAvatarMenu}
                  aria-hidden="true"
                />
                {/* Menu Dropdown */}
                <div
                  className="absolute right-0 top-full mt-2 z-50"
                  style={{
                    minWidth: '200px',
                    backgroundColor: 'var(--color-background-surface)',
                    borderRadius: 'var(--shape-radius-card)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-card)',
                    boxShadow: 'var(--shadow-card-elevated)',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                  }}
                >
                  <button
                    onClick={handleNavigateToProfile}
                    className="w-full flex items-center transition-colors duration-200 focus:outline-none"
                    style={{
                      height: '40px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      borderRadius: '40px',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-primary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div style={{ marginRight: 'var(--space-12)' }}>
                      <Icon name="user" size={20} color="var(--color-text-primary)" />
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--font-size-text-label)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)',
                        lineHeight: 'var(--font-line-height-default)',
                        letterSpacing: 'var(--font-letter-spacing-default)',
                      }}
                    >
                      Acessar Perfil
                    </span>
                  </button>
                  <button
                    onClick={handleNavigateToSettings}
                    className="w-full flex items-center transition-colors duration-200 focus:outline-none"
                    style={{
                      height: '40px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      borderRadius: '40px',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-primary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div style={{ marginRight: 'var(--space-12)' }}>
                      <Icon name="settings" size={20} color="var(--color-text-primary)" />
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--font-size-text-label)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)',
                        lineHeight: 'var(--font-line-height-default)',
                        letterSpacing: 'var(--font-letter-spacing-default)',
                      }}
                    >
                      Configurações
                    </span>
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center transition-colors duration-200 focus:outline-none"
                    style={{
                      height: '40px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      borderRadius: '40px',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-error)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-error)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div style={{ marginRight: 'var(--space-12)' }}>
                      <Icon name="log-out" size={20} color="var(--color-text-error)" />
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--font-size-text-label)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-error)',
                        lineHeight: 'var(--font-line-height-default)',
                        letterSpacing: 'var(--font-letter-spacing-default)',
                      }}
                    >
                      Sair
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer para empurrar conteúdo quando header está visível */}
      <div className="lg:hidden" style={{ height: 'var(--space-header-height)' }} />

      {/* Overlay escuro semi-transparente */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 transition-opacity duration-300"
          style={{
            backgroundColor: 'var(--color-background-action-primary)',
            opacity: 'var(--opacity-60)',
          }}
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}

      {/* Menu Dropdown */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          backgroundColor: 'var(--color-background-surface)',
          borderBottomColor: 'var(--color-border-default)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          boxShadow: 'var(--shadow-card-elevated)',
        }}
      >
        {/* Header do Menu */}
        <div
          className="flex items-center justify-between"
          style={{
            height: 'var(--space-header-height)',
            paddingLeft: 'var(--space-layout-component)',
            paddingRight: 'var(--space-layout-component)',
            borderBottomColor: 'var(--color-border-default)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
          }}
        >
          <div
            className="flex items-center"
            style={{
              height: 'var(--size-button-height-medium)',
            }}
          >
            <svg
              width="120"
              height="40"
              viewBox="0 0 275 73"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block', width: '80px', height: 'auto' }}
            >
              <path
                d="M257.284 12.6493L260.369 0H274.04L270.96 12.6493H257.284ZM242.986 71.3226L255.501 19.6551H269.172L256.657 71.3226H242.986Z"
                fill="#0023AF"
              />
              <path
                d="M170.176 71.3226L153.148 0H167.89L178.642 48.9917L191.68 0H208.805L221.309 49.8188L232.255 0H246.753L229.433 71.3226H214.157L199.951 18.0009L185.793 71.3226H170.176Z"
                fill="#0023AF"
              />
              <path
                d="M97.6738 44.7591C97.6738 40.2183 98.7928 35.8235 101.031 31.5746C103.269 27.3257 106.431 24.0823 110.518 21.8444C114.637 19.6064 119.226 18.4874 124.286 18.4874C132.103 18.4874 138.508 21.0335 143.503 26.1257C148.498 31.1854 150.996 37.5911 150.996 45.3429C150.996 53.1595 148.466 59.6463 143.406 64.8033C138.379 69.9279 132.038 72.4902 124.383 72.4902C119.648 72.4902 115.123 71.4199 110.81 69.2792C106.528 67.1386 103.269 64.0087 101.031 59.8896C98.7928 55.738 97.6738 50.6945 97.6738 44.7591ZM111.685 45.4888C111.685 50.6134 112.902 54.5379 115.334 57.2624C117.767 59.9869 120.767 61.3491 124.335 61.3491C127.902 61.3491 130.886 59.9869 133.286 57.2624C135.719 54.5379 136.935 50.581 136.935 45.3915C136.935 40.3318 135.719 36.4397 133.286 33.7152C130.886 30.9908 127.902 29.6285 124.335 29.6285C120.767 29.6285 117.767 30.9908 115.334 33.7152C112.902 36.4397 111.685 40.3642 111.685 45.4888Z"
                fill="#0023AF"
              />
              <path
                d="M76.5776 0.00222629L93.6055 71.3248L78.8642 71.3248L68.1123 22.3331L55.0737 71.3248L37.9485 71.3248L25.4452 21.506L14.4987 71.3248L0.00062561 71.3248L17.3204 0.00222111L32.5969 0.00222245L46.8031 53.3239L60.9605 0.00222493L76.5776 0.00222629Z"
                fill="#0023AF"
              />
            </svg>
          </div>
          <button
            onClick={handleCloseMenu}
            className="flex items-center justify-center focus:outline-none transition-colors duration-200"
            style={{
              width: 'var(--size-40)',
              height: 'var(--size-40)',
              borderRadius: '40px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            aria-label="Fechar menu"
          >
            <Icon name="x" size={24} color="var(--color-text-primary)" />
          </button>
        </div>

        {/* Conteúdo do Menu */}
        <div
          style={{
            paddingTop: 'var(--space-layout-component)',
            paddingBottom: 'var(--space-layout-component)',
            paddingLeft: '24px',
            paddingRight: '24px',
            maxHeight: 'calc(100vh - var(--space-header-height))',
            overflowY: 'auto',
          }}
        >
          {/* Informações do Usuário */}
          <div
            style={{
              paddingLeft: 'var(--space-layout-component)',
              paddingRight: 'var(--space-layout-component)',
              paddingBottom: 'var(--space-layout-component)',
              borderBottomColor: 'var(--color-border-default)',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              marginBottom: 'var(--space-layout-component)',
            }}
          >
            <div className="flex items-center" style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{ marginRight: 'var(--space-12)' }}>
                <Avatar src={userAvatar} alt={userName} size="md" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="truncate"
                  style={{
                    fontSize: 'var(--font-size-text-label)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 'var(--font-line-height-default)',
                    letterSpacing: 'var(--font-letter-spacing-default)',
                  }}
                >
                  {userName}
                </p>
                <p
                  className="truncate"
                  style={{
                    fontSize: 'var(--font-size-text-caption)',
                    fontWeight: 'var(--font-weight-regular)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--font-line-height-default)',
                    letterSpacing: 'var(--font-letter-spacing-default)',
                  }}
                >
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Itens de Navegação */}
          <nav>
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center transition-colors duration-200 focus:outline-none"
                  style={{
                    height: 'var(--size-button-height-large)',
                    paddingLeft: '16px',
                    paddingRight: 'var(--space-layout-component)',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    marginTop: '8px',
                    marginBottom: '8px',
                    gap: '0px',
                    borderRadius: '32px',
                    backgroundColor: isActive ? 'var(--color-background-action-primary)' : 'transparent',
                    color: isActive ? 'var(--color-background-action-secondary)' : 'var(--color-text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-sidebar-hover)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <div
                    style={{
                      marginRight: 'var(--space-12)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      name={item.icon as IconName}
                      size={20}
                      color={isActive ? 'var(--color-background-action-secondary)' : 'var(--color-text-secondary)'}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: isActive ? 'var(--color-background-action-secondary)' : 'var(--color-text-secondary)',
                      lineHeight: 'var(--font-line-height-default)',
                      letterSpacing: 'var(--font-letter-spacing-default)',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Botão Sair */}
          <div
            style={{
              paddingTop: 'var(--space-layout-component)',
              paddingLeft: 'var(--space-layout-component)',
              paddingRight: 'var(--space-layout-component)',
              borderTopColor: 'var(--color-border-default)',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              marginTop: 'var(--space-layout-component)',
            }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center transition-colors duration-200 focus:outline-none"
              style={{
                height: 'var(--size-button-height-large)',
                borderRadius: 'var(--shape-radius-button)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-error)',
                borderColor: 'var(--color-border-error)',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-error)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{ marginRight: 'var(--space-8)' }}>
                <Icon name="log-out" size={20} color="var(--color-text-error)" />
              </div>
              <span
                style={{
                  fontSize: 'var(--font-size-text-label)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-error)',
                  lineHeight: 'var(--font-line-height-default)',
                  letterSpacing: 'var(--font-letter-spacing-default)',
                }}
              >
                Sair
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Logout */}
      {isLogoutConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsLogoutConfirmOpen(false)}
        >
          <div
            className="relative"
            style={{
              width: '90%',
              maxWidth: '400px',
              padding: 'var(--space-24)',
              backgroundColor: 'var(--color-background-surface)',
              borderRadius: 'var(--shape-radius-modal)',
              boxShadow: 'var(--shadow-modal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-heading-section)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-16)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Confirmar Saída
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-text-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-24)',
              }}
            >
              Tem certeza que deseja sair da sua conta?
            </p>
            <div
              className="flex justify-end"
              style={{
                gap: 'var(--space-layout-component)',
              }}
            >
              <button
                onClick={() => setIsLogoutConfirmOpen(false)}
                style={{
                  padding: 'var(--space-padding-button-medium)',
                  borderRadius: 'var(--shape-radius-button)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-button-secondary)',
                  backgroundColor: 'var(--color-background-action-secondary)',
                  color: 'var(--color-text-action-secondary)',
                  fontSize: 'var(--font-size-button-medium)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: 'pointer',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: 'var(--space-padding-button-medium)',
                  borderRadius: 'var(--shape-radius-button)',
                  backgroundColor: 'var(--color-text-error)',
                  color: 'var(--color-text-on-action-primary)',
                  fontSize: 'var(--font-size-button-medium)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: 'pointer',
                  border: 'none',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
