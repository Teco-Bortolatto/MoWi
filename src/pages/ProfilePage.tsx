import { useState } from 'react'
import { useFinance } from '../contexts'
import { formatCurrency } from '../utils/formatCurrency'
import { Icon } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { NewFamilyMemberModal } from '../components/modals/NewFamilyMemberModal/NewFamilyMemberModal'

type Tab = 'info' | 'settings'

function ProfilePage() {
  const { familyMembers } = useFinance()
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [limitAlertEnabled, setLimitAlertEnabled] = useState(true)
  const [monthlySummaryEnabled, setMonthlySummaryEnabled] = useState(false)
  const [goalsNotificationEnabled, setGoalsNotificationEnabled] = useState(true)

  const currentUser = familyMembers[0] || null

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--color-background-dashboard)' }}>
      <div
        className="w-full lg:pt-[var(--space-layout-section)]"
        style={{
          paddingTop: 'calc(var(--space-layout-section) + var(--space-header-height))',
          paddingBottom: 'var(--space-layout-section)',
        }}
      >
        {/* Tabs */}
        <div
          className="flex border-b"
          style={{
            borderColor: 'var(--color-border-default)',
            marginBottom: 'var(--space-dashboard-padding)',
          }}
        >
          <button
            onClick={() => setActiveTab('info')}
            style={{
              padding: 'var(--space-padding-button-medium)',
              fontSize: 'var(--font-size-button-medium)',
              fontWeight: 'var(--font-weight-bold)',
              color: activeTab === 'info' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              borderBottomWidth: activeTab === 'info' ? '2px' : '0',
              borderBottomStyle: 'solid',
              borderBottomColor: 'var(--color-text-primary)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: 'var(--space-padding-button-medium)',
              fontSize: 'var(--font-size-button-medium)',
              fontWeight: 'var(--font-weight-bold)',
              color: activeTab === 'settings' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              borderBottomWidth: activeTab === 'settings' ? '2px' : '0',
              borderBottomStyle: 'solid',
              borderBottomColor: 'var(--color-text-primary)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Configurações
          </button>
        </div>

        {/* Conteúdo da aba Informações */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-layout-section)' }}>
            {/* Seção de perfil */}
            {currentUser && (
              <div
                style={{
                  backgroundColor: 'var(--color-background-card)',
                  borderRadius: 'var(--shape-radius-card)',
                  padding: 'var(--space-dashboard-padding)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-card)',
                }}
              >
                <div className="flex items-center" style={{ gap: '32px', paddingLeft: '16px', paddingRight: '16px' }}>
                  <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="lg" />
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        fontSize: 'var(--font-size-heading-card)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-gap-tight)',
                        fontFeatureSettings: "'liga' off",
                      }}
                    >
                      {currentUser.name}
                    </h2>
                    <p
                      style={{
                        fontSize: 'var(--font-size-text-body-medium)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-layout-element)',
                      }}
                    >
                      {currentUser.role}
                    </p>
                    {currentUser.email && (
                      <div className="flex items-center" style={{ gap: 'var(--space-layout-element)', marginBottom: 'var(--space-layout-element)' }}>
                        <Icon name="user" size={16} color="var(--color-text-secondary)" />
                        <span style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                          {currentUser.email}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center" style={{ gap: 'var(--space-layout-element)' }}>
                      <Icon name="wallet" size={16} color="var(--color-text-secondary)" />
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                        Renda mensal: {formatCurrency(currentUser.monthlyIncome)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seção membros da família */}
            <div
              style={{
                backgroundColor: 'var(--color-background-card)',
                borderRadius: 'var(--shape-radius-card)',
                padding: 'var(--space-layout-card)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-card)',
              }}
            >
              <div
                className="flex flex-col md:flex-row md:items-center md:justify-between"
                style={{
                  marginBottom: 'var(--space-layout-section)',
                  gap: 'var(--space-layout-component)',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--font-size-heading-card)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    fontFeatureSettings: "'liga' off",
                  }}
                >
                  Membros da Família
                </h3>
                <Button
                  onClick={() => setIsNewMemberModalOpen(true)}
                  variant="primary"
                  size="small"
                >
                  Adicionar Membro
                </Button>
              </div>

              {familyMembers.length === 1 ? (
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    padding: 'var(--space-dashboard-padding)',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-text-body-medium)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--space-layout-component)',
                    }}
                  >
                    Adicione outros membros da família para participar do controle financeiro.
                  </p>
                  <button
                    onClick={() => setIsNewMemberModalOpen(true)}
                    style={{
                      padding: 'var(--space-padding-button-medium)',
                      borderRadius: 'var(--shape-radius-button)',
                      backgroundColor: 'var(--color-background-action-primary)',
                      color: 'var(--color-text-on-action-primary)',
                      fontSize: 'var(--font-size-button-medium)',
                      fontWeight: 'var(--font-weight-bold)',
                      cursor: 'pointer',
                      fontFeatureSettings: "'liga' off",
                    }}
                  >
                    Adicionar Membro da Família
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-component)' }}>
                  {familyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between"
                      style={{
                        paddingTop: 'var(--space-layout-component)',
                        paddingBottom: 'var(--space-layout-component)',
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        gap: '32px',
                        backgroundColor: 'var(--color-background-secondary)',
                        borderRadius: 'var(--shape-radius-button)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)'
                      }}
                    >
                      <div className="flex items-center" style={{ gap: '32px' }}>
                        <Avatar src={member.avatarUrl} alt={member.name} size="md" />
                        <div>
                          <p
                            style={{
                              fontSize: 'var(--font-size-text-body-medium)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: 'var(--color-text-primary)',
                              marginBottom: 'var(--space-2)',
                            }}
                          >
                            {member.name}
                          </p>
                          <p
                            style={{
                              fontSize: 'var(--font-size-text-body-small)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 'var(--font-size-text-body-medium)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {formatCurrency(member.monthlyIncome)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão Sair */}
            <Button
              onClick={() => {
                // TODO: Implementar lógica de logout
                console.log('Logout clicked')
              }}
              variant="danger-primary"
              size="medium"
              icon="log-out"
              style={{ alignSelf: 'flex-start' }}
            >
              Sair
            </Button>
          </div>
        )}

        {/* Conteúdo da aba Configurações */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-layout-section)' }}>
            {/* Preferências de exibição */}
            <div
              style={{
                backgroundColor: 'var(--color-background-card)',
                borderRadius: 'var(--shape-radius-card)',
                padding: 'var(--space-layout-card)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-card)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-heading-card)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-layout-section)',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                Preferências de Exibição
              </h3>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-layout-component)' }}>
                <span style={{ fontSize: 'var(--font-size-text-body-medium)', color: 'var(--color-text-primary)' }}>
                  Modo Escuro
                </span>
                <div className="flex items-center" style={{ gap: 'var(--space-layout-element)' }}>
                  <span
                    style={{
                      fontSize: 'var(--font-size-button-small)',
                      color: 'var(--color-text-secondary)',
                      padding: 'var(--space-gap-tight) var(--space-layout-element)',
                      borderRadius: 'var(--shape-100)',
                      backgroundColor: 'var(--color-background-tertiary)',
                    }}
                  >
                    Em breve
                  </span>
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    disabled
                    style={{ opacity: 0.5 }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-layout-component)' }}>
                <span style={{ fontSize: 'var(--font-size-text-body-medium)', color: 'var(--color-text-primary)' }}>
                  Moeda padrão
                </span>
                <select
                  disabled
                  style={{
                    padding: 'var(--space-layout-element) var(--space-gap-component)',
                    borderRadius: 'var(--shape-radius-input)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-input-default)',
                    fontSize: 'var(--font-size-text-body-small)',
                    opacity: 0.5,
                  }}
                >
                  <option>Real Brasileiro (R$)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--font-size-text-body-medium)', color: 'var(--color-text-primary)' }}>
                  Formato de data
                </span>
                <select
                  disabled
                  style={{
                    padding: 'var(--space-layout-element) var(--space-gap-component)',
                    borderRadius: 'var(--shape-radius-input)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-input-default)',
                    fontSize: 'var(--font-size-text-body-small)',
                    opacity: 0.5,
                  }}
                >
                  <option>DD/MM/AAAA</option>
                </select>
              </div>
            </div>

            {/* Notificações */}
            <div
              style={{
                backgroundColor: 'var(--color-background-card)',
                borderRadius: 'var(--shape-radius-card)',
                padding: 'var(--space-layout-card)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-card)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-heading-card)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-layout-section)',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                Notificações
              </h3>
              {[
                { label: 'Lembrete de vencimento de contas', state: reminderEnabled, setState: setReminderEnabled },
                { label: 'Alerta de aproximação do limite de cartão', state: limitAlertEnabled, setState: setLimitAlertEnabled },
                { label: 'Resumo mensal por email', state: monthlySummaryEnabled, setState: setMonthlySummaryEnabled },
                { label: 'Notificações de novos objetivos alcançados', state: goalsNotificationEnabled, setState: setGoalsNotificationEnabled },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                  style={{ marginBottom: index < 3 ? 'var(--space-layout-component)' : '0' }}
                >
                  <span style={{ fontSize: 'var(--font-size-text-body-medium)', color: 'var(--color-text-primary)' }}>
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setState(e.target.checked)}
                    style={{ width: '20px', height: '20px' }}
                  />
                </div>
              ))}
            </div>

            {/* Dados e privacidade */}
            <div
              style={{
                backgroundColor: 'var(--color-background-card)',
                borderRadius: 'var(--shape-radius-card)',
                padding: 'var(--space-layout-card)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-card)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-heading-card)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-layout-section)',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                Dados e Privacidade
              </h3>
              <button
                onClick={() => {
                  // TODO: Implementar lógica de exportação de dados
                  console.log('Export data clicked')
                }}
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
                  marginBottom: 'var(--space-layout-component)',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                Exportar Todos os Dados
              </button>
              <button
                onClick={() => {
                  // TODO: Implementar lógica de limpeza de dados com confirmação
                  if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
                    console.log('Clear data confirmed')
                  }
                }}
                style={{
                  padding: 'var(--space-padding-button-medium)',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  borderRadius: 'var(--shape-radius-button)',
                  backgroundColor: 'var(--color-text-error)',
                  color: 'var(--color-text-on-action-primary)',
                  fontSize: 'var(--font-size-button-medium)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: 'pointer',
                  border: 'none',
                  marginBottom: 'var(--space-layout-element)',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                Limpar Todos os Dados
              </button>
              <p style={{ fontSize: 'var(--font-size-text-body-x-small)', color: 'var(--color-text-secondary)' }}>
                Esta ação não pode ser desfeita
              </p>
            </div>

            {/* Sobre */}
            <div
              style={{
                backgroundColor: 'var(--color-background-card)',
                borderRadius: 'var(--shape-radius-card)',
                padding: 'var(--space-layout-card)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-card)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-heading-card)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-layout-component)',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                Sobre o MoWi
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-text-body-small)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-layout-element)',
                }}
              >
                Versão: v1.0.0
              </p>
              <p
                style={{
                  fontSize: 'var(--font-size-text-body-small)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-layout-component)',
                }}
              >
                Sistema de gestão financeira familiar
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  style={{
                    fontSize: 'var(--font-size-text-body-small)',
                    color: 'var(--color-text-action-link)',
                    textDecoration: 'underline',
                  }}
                >
                  Termos de Uso
                </a>
                <a
                  href="#"
                  style={{
                    fontSize: 'var(--font-size-text-body-small)',
                    color: 'var(--color-text-action-link)',
                    textDecoration: 'underline',
                  }}
                >
                  Política de Privacidade
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <NewFamilyMemberModal
        isOpen={isNewMemberModalOpen}
        onClose={() => setIsNewMemberModalOpen(false)}
      />
    </div>
  )
}

export default ProfilePage
