# 🎨 Atribuições de Tokens Semânticos - MoWi

Este documento define as atribuições de tokens semânticos baseadas no design system do projeto.

## 📋 Estrutura de Nomenclatura

```
--{type}-{context}-{purpose}-{state?}
```

**Exemplos:**
- `--color-background-action-primary` (cor, background, ação primária)
- `--color-text-error-hover` (cor, texto, erro, hover)
- `--space-layout-container` (espaçamento, layout, container)
- `--font-size-heading-section` (fonte, tamanho, heading, seção)

---

## 🎨 CORES

### Backgrounds

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--color-background-primary` | `--color-neutral-0` | Fundo principal da aplicação |
| `--color-background-secondary` | `--color-neutral-100` | Fundo secundário (dashboard) |
| `--color-background-tertiary` | `--color-neutral-200` | Fundo terciário (hover states) |
| `--color-background-action-primary` | `--color-brand-500` | Botões primários (Nova Transação) - COR PRINCIPAL |
| `--color-background-action-primary-hover` | `--color-brand-600` | Botões primários hover |
| `--color-background-action-secondary` | `--color-neutral-0` | Botões secundários |
| `--color-background-action-secondary-hover` | `--color-neutral-200` | Botões secundários hover |
| `--color-background-surface` | `--color-neutral-0` | Superfícies (cards, modals) |
| `--color-background-surface-hover` | `--color-neutral-50` | Superfícies hover |
| `--color-background-card` | `--color-neutral-0` | Cards |
| `--color-background-card-hover` | `--color-neutral-50` | Cards hover |
| `--color-background-dashboard` | `--color-neutral-100` | Fundo do dashboard |
| `--color-background-dashboard-card` | `--color-neutral-0` | Cards do dashboard |
| `--color-background-input-default` | `--color-neutral-0` | Inputs padrão |
| `--color-background-input-hover` | `--color-neutral-50` | Inputs hover |
| `--color-background-input-focus` | `--color-neutral-0` | Inputs em foco |
| `--color-background-input-error` | `--color-red-50` | Inputs com erro |
| `--color-background-sidebar` | `--color-neutral-0` | Sidebar |
| `--color-background-sidebar-hover` | `--color-neutral-100` | Sidebar item hover |
| `--color-background-sidebar-active` | `--color-brand-100` | Sidebar item ativo |

### Textos

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--color-text-primary` | `--color-neutral-1000` | Texto principal |
| `--color-text-secondary` | `--color-neutral-600` | Texto secundário |
| `--color-text-tertiary` | `--color-neutral-500` | Texto terciário |
| `--color-text-disabled` | `--color-neutral-400` | Texto desabilitado |
| `--color-text-placeholder` | `--color-neutral-500` | Placeholder de inputs |
| `--color-text-action-primary` | `--color-neutral-0` | Texto em botão primário |
| `--color-text-action-secondary` | `--color-neutral-1000` | Texto em botão secundário |
| `--color-text-action-link` | `--color-brand-500` | Links |
| `--color-text-action-link-hover` | `--color-brand-600` | Links hover |
| `--color-text-success` | `--color-green-600` | Texto de sucesso |
| `--color-text-error` | `--color-red-600` | Texto de erro |
| `--color-text-warning` | `--color-yellow-600` | Texto de aviso |
| `--color-text-info` | `--color-brand-500` | Texto informativo (usa brand) |
| `--color-text-on-dark` | `--color-neutral-0` | Texto em fundo escuro |
| `--color-text-on-card-dark` | `--color-neutral-0` | Texto em card escuro |
| `--color-text-on-card-lime` | `--color-neutral-1000` | Texto em card lime |

### Bordas

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--color-border-default` | `--color-neutral-300` | Bordas padrão |
| `--color-border-hover` | `--color-neutral-400` | Bordas hover |
| `--color-border-focus` | `--color-brand-500` | Bordas em foco - usa brand |
| `--color-border-input-default` | `--color-neutral-500` | Inputs padrão |
| `--color-border-input-hover` | `--color-neutral-600` | Inputs hover |
| `--color-border-input-focus` | `--color-neutral-1000` | Inputs em foco |
| `--color-border-input-error` | `--color-red-600` | Inputs com erro |
| `--color-border-card` | `#D0D5DC` | Cards padrão |
| `--color-border-card-hover` | `--color-brand-500` | Cards hover (carrossel) - usa brand |
| `--color-border-button-primary` | `--color-neutral-1000` | Botões primários |
| `--color-border-button-action` | `--color-brand-500` | Botões de ação |

---

## 📏 ESPAÇAMENTOS

### Layout

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--space-layout-container` | `--space-32` | Padding de containers principais |
| `--space-layout-section` | `--space-24` | Espaçamento entre seções |
| `--space-layout-card` | `--space-24` | Padding de cards |
| `--space-layout-component` | `--space-16` | Espaçamento entre componentes |
| `--space-layout-element` | `--space-8` | Espaçamento entre elementos |

### Padding

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--space-padding-container` | `--space-32` | Padding de containers |
| `--space-padding-section` | `--space-24` | Padding de seções |
| `--space-padding-card` | `--space-24` | Padding de cards |
| `--space-padding-modal` | `--space-24` | Padding de modals |
| `--space-padding-button-small` | `var(--space-8) var(--space-12)` | Padding de botões pequenos |
| `--space-padding-button-medium` | `var(--space-12) var(--space-16)` | Padding de botões médios |
| `--space-padding-button-large` | `var(--space-16) var(--space-24)` | Padding de botões grandes |
| `--space-padding-input` | `--space-16` | Padding de inputs |
| `--space-padding-icon` | `--space-8` | Padding de ícones |

### Gap

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--space-gap-section` | `--space-24` | Gap entre seções |
| `--space-gap-card` | `--space-16` | Gap entre cards |
| `--space-gap-component` | `--space-12` | Gap entre componentes |
| `--space-gap-element` | `--space-8` | Gap entre elementos |
| `--space-gap-tight` | `--space-4` | Gap apertado |
| `--space-gap-loose` | `--space-32` | Gap largo |

### Específicos

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--space-header-height` | `--size-56` | Altura do header |
| `--space-sidebar-padding` | `--space-8` | Padding da sidebar |
| `--space-dashboard-padding` | `--space-32` | Padding do dashboard |

---

## 📐 TAMANHOS

### Botões

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--size-button-height-small` | `--size-32` | Botões pequenos |
| `--size-button-height-medium` | `--size-40` | Botões médios |
| `--size-button-height-large` | `--size-44` | Botões grandes |
| `--size-button-height-xlarge` | `--size-56` | Botões extra grandes |
| `--size-button-width-min` | `164px` | Largura mínima de botões |

### Inputs

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--size-input-height-small` | `--size-40` | Inputs pequenos |
| `--size-input-height-medium` | `--size-48` | Inputs médios |
| `--size-input-height-large` | `--size-56` | Inputs grandes |
| `--size-input-search-height` | `--size-56` | Altura do campo de busca |

### Ícones

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--size-icon-small` | `--size-16` | Ícones pequenos |
| `--size-icon-medium` | `--size-20` | Ícones médios |
| `--size-icon-large` | `--size-24` | Ícones grandes |
| `--size-icon-xlarge` | `--size-32` | Ícones extra grandes |

### Avatares

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--size-avatar-xs` | `--size-24` | Avatares extra pequenos (tabela) |
| `--size-avatar-small` | `--size-32` | Avatares pequenos |
| `--size-avatar-medium` | `--size-44` | Avatares médios |
| `--size-avatar-large` | `--size-48` | Avatares grandes |

### Layout

| Token Semântico | Valor | Uso |
|----------------|-------|-----|
| `--size-sidebar-width-expanded` | `256px` | Sidebar expandida |
| `--size-sidebar-width-collapsed` | `80px` | Sidebar colapsada |
| `--size-modal-width-small` | `400px` | Modals pequenos |
| `--size-modal-width-medium` | `500px` | Modals médios |
| `--size-modal-width-large` | `600px` | Modals grandes |
| `--size-card-donut-width` | `214px` | Largura do card donut |

---

## 🔤 TIPOGRAFIA

### Títulos

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--font-size-heading-page` | `--font-size-heading-large` | Títulos de página |
| `--font-size-heading-section` | `--font-size-heading-small` | Títulos de seção |
| `--font-size-heading-card` | `--font-size-heading-x-small` | Títulos de card |
| `--font-size-heading-widget` | `--font-size-heading-x-small` | Títulos de widgets |
| `--font-size-heading-label` | `--font-size-label-medium` | Labels de formulário |

### Textos

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--font-size-text-body` | `--font-size-paragraph-medium` | Corpo de texto |
| `--font-size-text-small` | `--font-size-paragraph-small` | Texto pequeno |
| `--font-size-text-caption` | `--font-size-paragraph-x-small` | Legendas |
| `--font-size-text-label` | `--font-size-label-small` | Labels |

### Botões

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--font-size-button-small` | `--font-size-label-small` | Botões pequenos |
| `--font-size-button-medium` | `--font-size-label-medium` | Botões médios |
| `--font-size-button-large` | `--font-size-label-large` | Botões grandes |

### Inputs

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--font-size-input-small` | `--font-size-paragraph-small` | Inputs pequenos |
| `--font-size-input-medium` | `--font-size-paragraph-medium` | Inputs médios |
| `--font-size-input-large` | `--font-size-paragraph-large` | Inputs grandes |

### Valores Monetários

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--font-size-value-large` | `--font-size-heading-medium` | Valores grandes |
| `--font-size-value-medium` | `--font-size-heading-small` | Valores médios |
| `--font-size-value-small` | `--font-size-label-large` | Valores pequenos |

---

## 🎭 FORMAS

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--shape-radius-button` | `--shape-100` | Botões (totalmente arredondado) |
| `--shape-radius-input` | `--shape-100` | Inputs (totalmente arredondado) |
| `--shape-radius-search` | `--shape-100` | Campo de busca |
| `--shape-radius-card` | `--shape-16` | Cards |
| `--shape-radius-modal` | `--shape-16` | Modals |
| `--shape-radius-badge` | `--shape-100` | Badges |
| `--shape-radius-avatar` | `--shape-100` | Avatares |
| `--shape-radius-icon` | `--shape-8` | Ícones em containers |

---

## 🌑 SOMBRAS

| Token Semântico | Composição | Uso |
|----------------|------------|-----|
| `--shadow-elevation-0` | `none` | Sem elevação |
| `--shadow-elevation-1` | `0 2px 4px rgba(8, 11, 18, 0.05)` | Elevação leve |
| `--shadow-elevation-2` | `0 4px 8px rgba(8, 11, 18, 0.1)` | Elevação média |
| `--shadow-elevation-3` | `0 16px 24px rgba(8, 11, 18, 0.16)` | Elevação alta |
| `--shadow-elevation-4` | `0 24px 32px rgba(8, 11, 18, 0.24)` | Elevação muito alta |
| `--shadow-card-default` | `--shadow-elevation-0` | Cards padrão |
| `--shadow-card-hover` | `--shadow-elevation-2` | Cards hover |
| `--shadow-card-elevated` | `--shadow-elevation-3` | Cards elevados |
| `--shadow-modal` | `--shadow-elevation-4` | Modals |
| `--shadow-modal-backdrop` | `rgba(0, 0, 0, 0.5)` | Backdrop de modals |
| `--shadow-input-focus` | `0 0 0 2px rgba(51, 129, 255, 0.05)` | Inputs em foco |
| `--shadow-button-hover` | `--shadow-elevation-1` | Botões hover |
| `--shadow-button-active` | `--shadow-elevation-0` | Botões ativos |

---

## 📝 Notas de Uso

### Quando usar tokens semânticos vs primitivos

✅ **Use tokens semânticos quando:**
- Estiver criando componentes reutilizáveis
- Precisar de consistência visual entre componentes similares
- Quiser facilitar mudanças futuras no design
- Estiver seguindo padrões do design system

❌ **Use tokens primitivos quando:**
- Estiver criando variações muito específicas
- Precisar de valores que não se encaixam em contextos semânticos
- Estiver prototipando rapidamente
- O valor for único e não reutilizável

### Exemplo de migração

**Antes (primitivo):**
```tsx
style={{
  backgroundColor: 'var(--color-neutral-0)',
  color: 'var(--color-neutral-1000)',
  padding: 'var(--space-24)',
  borderRadius: 'var(--shape-16)',
}}
```

**Depois (semântico):**
```tsx
style={{
  backgroundColor: 'var(--color-background-card)',
  color: 'var(--color-text-primary)',
  padding: 'var(--space-padding-card)',
  borderRadius: 'var(--shape-radius-card)',
}}
```

---

## 🔄 Status de Implementação

- ✅ Tokens semânticos criados em `semantic-tokens.css`
- ⏳ Componentes sendo refatorados para usar tokens semânticos
- ⏳ Documentação sendo atualizada
