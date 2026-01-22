# 🎨 Mapeamento de Tokens Semânticos

Este documento mapeia tokens primitivos para tokens semânticos, facilitando a manutenção e evolução do design system.

## 📋 Estrutura

### Formato de Nomenclatura
```
--{type}-{context}-{purpose}-{state?}
```

**Exemplos:**
- `--color-background-action-primary`
- `--color-text-error-hover`
- `--space-layout-container`
- `--font-size-heading-section`

---

## 🎨 CORES

### Backgrounds

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--color-background-primary` | `--color-neutral-0` | Fundo principal da aplicação |
| `--color-background-secondary` | `--color-neutral-100` | Fundo secundário (cards, seções) |
| `--color-background-tertiary` | `--color-neutral-200` | Fundo terciário (hover states) |
| `--color-background-action-primary` | `--color-brand-500` | Botões primários |
| `--color-background-action-primary-hover` | `--color-brand-600` | Botões primários hover |
| `--color-background-action-secondary` | `--color-neutral-0` | Botões secundários |
| `--color-background-surface` | `--color-neutral-0` | Superfícies (cards, modals) |
| `--color-background-input-default` | `--color-neutral-0` | Inputs padrão |
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
| `--color-text-action-primary` | `--color-neutral-0` | Texto em botão primário |
| `--color-text-action-secondary` | `--color-brand-500` | Texto em botão secundário |
| `--color-text-action-link` | `--color-brand-500` | Links |
| `--color-text-success` | `--color-green-600` | Texto de sucesso |
| `--color-text-error` | `--color-red-600` | Texto de erro |
| `--color-text-warning` | `--color-yellow-600` | Texto de aviso |
| `--color-text-on-dark` | `--color-neutral-0` | Texto em fundo escuro |

### Bordas

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--color-border-default` | `--color-neutral-300` | Bordas padrão |
| `--color-border-hover` | `--color-neutral-400` | Bordas hover |
| `--color-border-focus` | `--color-brand-500` | Bordas em foco |
| `--color-border-input-default` | `--color-neutral-500` | Inputs padrão |
| `--color-border-input-focus` | `--color-neutral-1000` | Inputs em foco |
| `--color-border-input-error` | `--color-red-600` | Inputs com erro |
| `--color-border-card` | `#D0D5DC` | Cards padrão |
| `--color-border-card-hover` | `--color-yellow-400` | Cards hover |

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
| `--space-padding-button` | `var(--space-12) var(--space-16)` | Padding de botões |
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

---

## 📐 TAMANHOS

### Componentes

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--size-button-height-small` | `--size-32` | Botões pequenos |
| `--size-button-height-medium` | `--size-40` | Botões médios |
| `--size-button-height-large` | `--size-48` | Botões grandes |
| `--size-button-height-xlarge` | `--size-56` | Botões extra grandes |
| `--size-input-height-medium` | `--size-48` | Inputs médios |
| `--size-input-height-large` | `--size-56` | Inputs grandes |
| `--size-icon-small` | `--size-16` | Ícones pequenos |
| `--size-icon-medium` | `--size-20` | Ícones médios |
| `--size-icon-large` | `--size-24` | Ícones grandes |
| `--size-avatar-small` | `--size-24` | Avatares pequenos |
| `--size-avatar-medium` | `--size-32` | Avatares médios |
| `--size-avatar-large` | `--size-44` | Avatares grandes |

---

## 🔤 TIPOGRAFIA

### Títulos

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--font-size-heading-page` | `--font-size-heading-large` | Títulos de página |
| `--font-size-heading-section` | `--font-size-heading-small` | Títulos de seção |
| `--font-size-heading-card` | `--font-size-heading-x-small` | Títulos de card |
| `--font-size-heading-label` | `--font-size-label-medium` | Labels de formulário |

### Textos

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--font-size-text-body` | `--font-size-paragraph-medium` | Corpo de texto |
| `--font-size-text-small` | `--font-size-paragraph-small` | Texto pequeno |
| `--font-size-text-caption` | `--font-size-paragraph-x-small` | Legendas |

### Botões

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--font-size-button-small` | `--font-size-label-small` | Botões pequenos |
| `--font-size-button-medium` | `--font-size-label-medium` | Botões médios |
| `--font-size-button-large` | `--font-size-label-large` | Botões grandes |

---

## 🎭 FORMAS

| Token Semântico | Token Primitivo | Uso |
|----------------|-----------------|-----|
| `--shape-radius-button` | `--shape-100` | Botões (totalmente arredondado) |
| `--shape-radius-input` | `--shape-100` | Inputs (totalmente arredondado) |
| `--shape-radius-card` | `--shape-16` | Cards |
| `--shape-radius-modal` | `--shape-16` | Modals |
| `--shape-radius-badge` | `--shape-100` | Badges |
| `--shape-radius-avatar` | `--shape-100` | Avatares |

---

## 🌑 SOMBRAS

| Token Semântico | Composição | Uso |
|----------------|------------|-----|
| `--shadow-elevation-1` | `0 2px 4px rgba(8, 11, 18, 0.05)` | Elevação leve |
| `--shadow-elevation-2` | `0 4px 8px rgba(8, 11, 18, 0.1)` | Elevação média |
| `--shadow-elevation-3` | `0 16px 24px rgba(8, 11, 18, 0.16)` | Elevação alta |
| `--shadow-elevation-4` | `0 24px 32px rgba(8, 11, 18, 0.24)` | Elevação muito alta |
| `--shadow-card-default` | `--shadow-elevation-1` | Cards padrão |
| `--shadow-card-hover` | `--shadow-elevation-2` | Cards hover |
| `--shadow-modal` | `--shadow-elevation-4` | Modals |
| `--shadow-input-focus` | `0 0 0 2px rgba(51, 129, 255, 0.05)` | Inputs em foco |

---

## 📝 Notas de Uso

### Quando usar tokens semânticos vs primitivos

✅ **Use tokens semânticos quando:**
- Estiver criando componentes reutilizáveis
- Precisar de consistência visual entre componentes similares
- Quiser facilitar mudanças futuras no design

❌ **Use tokens primitivos quando:**
- Estiver criando variações muito específicas
- Precisar de valores que não se encaixam em contextos semânticos
- Estiver prototipando rapidamente

### Exemplo de migração

**Antes (primitivo):**
```tsx
style={{
  backgroundColor: 'var(--color-neutral-0)',
  color: 'var(--color-neutral-1000)',
  padding: 'var(--space-24)',
}}
```

**Depois (semântico):**
```tsx
style={{
  backgroundColor: 'var(--color-background-surface)',
  color: 'var(--color-text-primary)',
  padding: 'var(--space-padding-card)',
}}
```

---

## 🔄 Próximos Passos

1. ✅ Tokens semânticos criados
2. ⏳ Atualizar componentes para usar tokens semânticos
3. ⏳ Documentar padrões de uso por componente
4. ⏳ Criar guia de migração
