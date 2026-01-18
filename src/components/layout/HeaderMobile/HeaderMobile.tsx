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
  }

  return (
    <>
      {/* Header Mobile - apenas mobile/tablet (<1280px) */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: 'var(--size-80)',
          backgroundColor: 'var(--color-neutral-0)',
          borderBottomColor: 'var(--color-neutral-300)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          paddingLeft: 'var(--space-16)',
          paddingRight: 'var(--space-16)',
          boxShadow: `0 var(--shadow-offset-y-down-2) var(--shadow-blur-4) var(--shadow-spread-0) var(--shadow-color-neutral-4)`,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center"
          style={{
            height: 'var(--size-40)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-label-large)',
              color: 'var(--color-neutral-900)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--font-line-height-default)',
              letterSpacing: 'var(--font-letter-spacing-default)',
            }}
          >
            MoWi
          </span>
        </div>

        {/* Avatar clicável */}
        <button
          onClick={handleMenuToggle}
          className="flex items-center justify-center focus:outline-none transition-opacity duration-200"
          style={{
            width: 'var(--size-40)',
            height: 'var(--size-40)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
        >
          <Avatar src={userAvatar} alt={userName} size="sm" />
        </button>
      </header>

      {/* Spacer para empurrar conteúdo quando header está visível */}
      <div className="lg:hidden" style={{ height: 'var(--size-80)' }} />

      {/* Overlay escuro semi-transparente */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 transition-opacity duration-300"
          style={{
            backgroundColor: 'var(--color-neutral-1100)',
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
          backgroundColor: 'var(--color-neutral-0)',
          borderBottomColor: 'var(--color-neutral-300)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          boxShadow: `0 var(--shadow-offset-y-down-16) var(--shadow-blur-24) var(--shadow-spread-0) var(--shadow-color-neutral-24)`,
        }}
      >
        {/* Header do Menu */}
        <div
          className="flex items-center justify-between"
          style={{
            height: 'var(--size-80)',
            paddingLeft: 'var(--space-16)',
            paddingRight: 'var(--space-16)',
            borderBottomColor: 'var(--color-neutral-300)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
          }}
        >
          <div
            className="flex items-center"
            style={{
              height: 'var(--size-40)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-label-large)',
                color: 'var(--color-neutral-900)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--font-line-height-default)',
                letterSpacing: 'var(--font-letter-spacing-default)',
              }}
            >
              MoWi
            </span>
          </div>
          <button
            onClick={handleCloseMenu}
            className="flex items-center justify-center focus:outline-none transition-colors duration-200"
            style={{
              width: 'var(--size-40)',
              height: 'var(--size-40)',
              borderRadius: 'var(--shape-8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            aria-label="Fechar menu"
          >
            <Icon name="x" size={24} color="var(--color-neutral-900)" />
          </button>
        </div>

        {/* Conteúdo do Menu */}
        <div
          style={{
            paddingTop: 'var(--space-16)',
            paddingBottom: 'var(--space-16)',
            maxHeight: 'calc(100vh - var(--size-80))',
            overflowY: 'auto',
          }}
        >
          {/* Informações do Usuário */}
          <div
            style={{
              paddingLeft: 'var(--space-16)',
              paddingRight: 'var(--space-16)',
              paddingBottom: 'var(--space-16)',
              borderBottomColor: 'var(--color-neutral-300)',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              marginBottom: 'var(--space-16)',
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
                    fontSize: 'var(--font-size-label-small)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-neutral-900)',
                    lineHeight: 'var(--font-line-height-default)',
                    letterSpacing: 'var(--font-letter-spacing-default)',
                  }}
                >
                  {userName}
                </p>
                <p
                  className="truncate"
                  style={{
                    fontSize: 'var(--font-size-label-x-small)',
                    fontWeight: 'var(--font-weight-regular)',
                    color: 'var(--color-neutral-600)',
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
                    height: 'var(--size-48)',
                    paddingLeft: 'var(--space-16)',
                    paddingRight: 'var(--space-16)',
                    marginBottom: 'var(--space-4)',
                    backgroundColor: isActive ? 'var(--color-neutral-1100)' : 'transparent',
                    color: isActive ? 'var(--color-neutral-0)' : 'var(--color-neutral-600)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
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
                      color={isActive ? 'var(--color-green-600)' : 'var(--color-neutral-600)'}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-size-label-medium)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: isActive ? 'var(--color-neutral-0)' : 'var(--color-neutral-600)',
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
              paddingTop: 'var(--space-16)',
              paddingLeft: 'var(--space-16)',
              paddingRight: 'var(--space-16)',
              borderTopColor: 'var(--color-neutral-300)',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              marginTop: 'var(--space-16)',
            }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center transition-colors duration-200 focus:outline-none"
              style={{
                height: 'var(--size-48)',
                borderRadius: 'var(--shape-8)',
                backgroundColor: 'transparent',
                color: 'var(--color-red-600)',
                borderColor: 'var(--color-red-600)',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-red-100)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{ marginRight: 'var(--space-8)' }}>
                <Icon name="log-out" size={20} color="var(--color-red-600)" />
              </div>
              <span
                style={{
                  fontSize: 'var(--font-size-label-medium)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-red-600)',
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
    </>
  )
}
