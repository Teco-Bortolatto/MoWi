# 🚀 Push Rápido para GitHub

## ⚡ Método Mais Rápido (Personal Access Token)

1. **Crie um Personal Access Token:**
   - Acesse: https://github.com/settings/tokens
   - Clique em "Generate new token" → "Generate new token (classic)"
   - Nome: `mycash-plus-push`
   - Expiração: 90 dias (ou conforme necessário)
   - Permissões: Marque apenas `repo`
   - Clique em "Generate token"
   - **COPIE O TOKEN** (você não verá novamente!)

2. **Execute o push:**
   ```bash
   git push origin main
   ```
   
3. **Quando solicitado:**
   - Username: `Teco-Bortolatto`
   - Password: **Cole o token** (não sua senha do GitHub)

---

## 🔐 Método SSH (Recomendado para longo prazo)

### Passo 1: Gerar chave SSH
```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
# Pressione Enter para aceitar local padrão
# Digite uma senha (opcional, mas recomendado)
```

### Passo 2: Adicionar chave ao ssh-agent
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Passo 3: Copiar chave pública
```bash
cat ~/.ssh/id_ed25519.pub
# Copie toda a saída (começa com ssh-ed25519...)
```

### Passo 4: Adicionar no GitHub
- Acesse: https://github.com/settings/keys
- Clique em "New SSH key"
- Título: `MacBook Air - mycash+`
- Cole a chave pública
- Clique em "Add SSH key"

### Passo 5: Alterar remote para SSH
```bash
git remote set-url origin git@github.com:Teco-Bortolatto/MoWi.git
```

### Passo 6: Fazer push
```bash
git push origin main
```

---

## ✅ Verificar se funcionou

Após o push, verifique:
```bash
git log origin/main..HEAD
# Se não retornar nada, o push foi bem-sucedido!
```

Ou acesse: https://github.com/Teco-Bortolatto/MoWi

---

## 🔗 Próximo: Conectar ao Vercel

Após o push bem-sucedido:

1. Acesse: https://vercel.com/login
2. Faça login com GitHub
3. Clique em "Add New Project"
4. Importe: `Teco-Bortolatto/MoWi`
5. Deploy automático! 🎉
