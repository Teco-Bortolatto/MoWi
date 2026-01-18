# 🚀 Como Fazer Push - Guia Visual Passo a Passo

## ⚡ Método Mais Rápido (Recomendado)

### Passo 1: Criar Personal Access Token no GitHub

1. **Abra seu navegador** e acesse:
   ```
   https://github.com/settings/tokens
   ```

2. **Clique no botão verde** no topo:
   ```
   "Generate new token" → "Generate new token (classic)"
   ```

3. **Preencha o formulário:**
   - **Note:** Digite `mycash-plus-push`
   - **Expiration:** Escolha `90 days` (ou o que preferir)
   - **Scopes:** Marque APENAS a opção `repo` ✅
     - Isso dá acesso aos repositórios
     - NÃO marque outras opções

4. **Role até o final** e clique em:
   ```
   "Generate token" (botão verde)
   ```

5. **⚠️ IMPORTANTE:** Copie o token que aparece
   - Ele começa com `ghp_` seguido de letras e números
   - Exemplo: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`
   - **VOCÊ NÃO VERÁ ESTE TOKEN NOVAMENTE!**
   - Cole em um arquivo de texto temporário se necessário

---

### Passo 2: Fazer Push no Terminal

1. **Abra o Terminal** (no Cursor ou no Mac)

2. **Navegue até a pasta do projeto:**
   ```bash
   cd "/Users/sthefanobortolatto/Downloads/pasta sem título"
   ```

3. **Execute o push:**
   ```bash
   git push origin main
   ```

4. **Quando aparecer "Username for 'https://github.com':"**
   - Digite: `Teco-Bortolatto`
   - Pressione Enter

5. **Quando aparecer "Password for 'https://Teco-Bortolatto@github.com':"**
   - **NÃO digite sua senha do GitHub!**
   - **Cole o token** que você copiou no Passo 1
   - Pressione Enter

6. **Se funcionar, você verá:**
   ```
   Enumerating objects: X, done.
   Counting objects: 100% (X/X), done.
   Writing objects: 100% (X/X), done.
   To https://github.com/Teco-Bortolatto/MoWi.git
      [hash]..[hash]  main -> main
   ```

---

### Passo 3: Verificar se Funcionou

Execute no terminal:
```bash
git log origin/main..HEAD
```

**Se não retornar nada** = ✅ **SUCESSO!**

Ou acesse no navegador:
```
https://github.com/Teco-Bortolatto/MoWi
```

Você deve ver seus commits mais recentes lá!

---

## 🔐 Método Alternativo: SSH (Mais Seguro)

Se preferir usar SSH (não precisa digitar token toda vez):

### Passo 1: Gerar Chave SSH

No terminal, execute:
```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
```

- Quando perguntar "Enter file in which to save the key", apenas pressione **Enter**
- Quando perguntar "Enter passphrase", você pode:
  - Pressionar Enter (sem senha) - mais fácil
  - Ou digitar uma senha - mais seguro

### Passo 2: Copiar Chave Pública

Execute:
```bash
cat ~/.ssh/id_ed25519.pub
```

**Copie toda a saída** (começa com `ssh-ed25519` e termina com seu email)

### Passo 3: Adicionar no GitHub

1. Acesse: https://github.com/settings/keys
2. Clique em **"New SSH key"** (botão verde)
3. Preencha:
   - **Title:** `MacBook Air - mycash+`
   - **Key:** Cole a chave que você copiou
4. Clique em **"Add SSH key"**

### Passo 4: Alterar Remote para SSH

No terminal, execute:
```bash
cd "/Users/sthefanobortolatto/Downloads/pasta sem título"
git remote set-url origin git@github.com:Teco-Bortolatto/MoWi.git
```

### Passo 5: Fazer Push

```bash
git push origin main
```

Agora não precisa mais de token! 🎉

---

## 🐛 Problemas Comuns

### Erro: "fatal: could not read Username"

**Solução:** Você precisa fazer login. Use o método do Personal Access Token acima.

### Erro: "Permission denied (publickey)"

**Solução:** Configure SSH (veja método alternativo acima).

### Erro: "remote: Invalid username or password"

**Solução:** 
- Certifique-se de usar o **token**, não sua senha
- Verifique se o token tem permissão `repo`
- Crie um novo token se necessário

### Token não funciona

**Solução:**
1. Verifique se o token não expirou
2. Crie um novo token
3. Certifique-se de que marcou a opção `repo`

---

## ✅ Checklist Rápido

- [ ] Token criado no GitHub
- [ ] Token copiado (começa com `ghp_`)
- [ ] Terminal aberto na pasta do projeto
- [ ] Comando `git push origin main` executado
- [ ] Username digitado: `Teco-Bortolatto`
- [ ] Token colado como senha
- [ ] Push bem-sucedido!

---

## 🎯 Depois do Push

Após o push bem-sucedido, conecte ao Vercel:

1. Acesse: https://vercel.com/login
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Importe: `Teco-Bortolatto/MoWi`
5. Deploy automático! 🚀

---

**Precisa de mais ajuda?** Me avise qual passo está travando!
