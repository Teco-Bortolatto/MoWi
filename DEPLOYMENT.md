# 🚀 Guia de Deploy - Git + Vercel

Este documento explica como configurar o Git e conectar o projeto ao Vercel para deploy automático.

---

## ✅ Status Atual

- ✅ **Git inicializado** e conectado ao repositório: `https://github.com/Teco-Bortolatto/MoWi.git`
- ✅ **Branch:** `main`
- ⚠️ **1 commit local** pendente de push
- ⚠️ **Vercel CLI** não instalado (opcional, mas recomendado)

---

## 📤 Passo 1: Enviar Commits para o GitHub

### Opção A: Usando HTTPS (requer autenticação)

Se você ainda não configurou autenticação no Git, você pode:

1. **Usar Personal Access Token (recomendado):**
   - Acesse: https://github.com/settings/tokens
   - Crie um novo token com permissões `repo`
   - Ao fazer push, use o token como senha:
   ```bash
   git push origin main
   # Username: seu-usuario-github
   # Password: [cole o token aqui]
   ```

2. **Ou configurar credenciais salvas:**
   ```bash
   git config --global credential.helper osxkeychain  # macOS
   # ou
   git config --global credential.helper store       # Linux/Windows
   ```

### Opção B: Usar SSH (mais seguro)

1. **Gerar chave SSH (se ainda não tiver):**
   ```bash
   ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
   ```

2. **Adicionar chave ao GitHub:**
   - Copie a chave pública: `cat ~/.ssh/id_ed25519.pub`
   - Adicione em: https://github.com/settings/keys

3. **Alterar remote para SSH:**
   ```bash
   git remote set-url origin git@github.com:Teco-Bortolatto/MoWi.git
   git push origin main
   ```

---

## 🔗 Passo 2: Conectar ao Vercel

### Método 1: Via Dashboard do Vercel (Recomendado)

1. **Acesse:** https://vercel.com/login
2. **Faça login** com sua conta (GitHub, GitLab, etc.)
3. **Clique em "Add New Project"**
4. **Importe o repositório:**
   - Selecione `Teco-Bortolatto/MoWi`
   - O Vercel detectará automaticamente o `vercel.json`
5. **Configure o projeto:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (já configurado no vercel.json)
   - Output Directory: `dist` (já configurado no vercel.json)
   - Install Command: `npm install` (já configurado no vercel.json)
6. **Clique em "Deploy"**

### Método 2: Via Vercel CLI (Opcional)

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Fazer login:**
   ```bash
   vercel login
   ```

3. **Conectar projeto:**
   ```bash
   vercel
   ```
   - Siga as instruções interativas
   - O CLI detectará o `vercel.json` automaticamente

4. **Fazer deploy de produção:**
   ```bash
   vercel --prod
   ```

---

## 🔄 Deploy Automático

Após conectar o repositório ao Vercel:

- ✅ **Cada push para `main`** → Deploy automático de produção
- ✅ **Pull Requests** → Preview deployments automáticos
- ✅ **Builds** executados automaticamente no Vercel
- ✅ **URLs** geradas automaticamente (ex: `mo-wi.vercel.app`)

---

## 📋 Configuração Atual do Projeto

O projeto já está configurado com `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Esta configuração:
- ✅ Define Vite como framework
- ✅ Configura build e output corretos
- ✅ Configura rewrites para SPA (React Router)

---

## 🐛 Troubleshooting

### Erro: "Device not configured" no Git Push

**Solução:** Configure autenticação (veja Passo 1)

### Erro: "Repository not found" no Vercel

**Solução:** 
- Verifique se o repositório é público ou se você tem acesso
- Verifique se conectou a conta GitHub correta no Vercel

### Build falha no Vercel

**Solução:**
- Verifique os logs no dashboard do Vercel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se não há erros de TypeScript: `npm run build` localmente

---

## 📝 Próximos Passos

1. ✅ Fazer push dos commits pendentes
2. ✅ Conectar repositório ao Vercel
3. ✅ Verificar primeiro deploy
4. ✅ Configurar domínio customizado (opcional)

---

## 🔗 Links Úteis

- **Repositório:** https://github.com/Teco-Bortolatto/MoWi
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vercel:** https://vercel.com/docs
- **GitHub Personal Access Tokens:** https://github.com/settings/tokens
