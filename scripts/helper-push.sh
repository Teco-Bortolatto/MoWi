#!/bin/bash

# Script Helper para Push - mycash+
# Este script guia você passo a passo para fazer push

echo "🚀 Helper de Push - mycash+"
echo "================================"
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto"
    exit 1
fi

echo "✅ Pasta correta detectada"
echo ""

# Verificar status do Git
echo "📊 Status atual do Git:"
git status -sb
echo ""

# Verificar commits pendentes
COMMITS_AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")

if [ "$COMMITS_AHEAD" -eq "0" ]; then
    echo "✅ Não há commits pendentes para push"
    exit 0
fi

echo "📤 Commits prontos para push: $COMMITS_AHEAD"
git log origin/main..HEAD --oneline
echo ""

# Verificar método de autenticação
REMOTE_URL=$(git remote get-url origin)

if [[ "$REMOTE_URL" == *"https://"* ]]; then
    echo "🔐 Método de autenticação: HTTPS"
    echo ""
    echo "Você precisará de um Personal Access Token do GitHub"
    echo ""
    echo "📋 Passos:"
    echo "1. Acesse: https://github.com/settings/tokens"
    echo "2. Clique em 'Generate new token' → 'Generate new token (classic)'"
    echo "3. Nome: mycash-plus-push"
    echo "4. Expiração: 90 days"
    echo "5. Permissões: Marque APENAS 'repo' ✅"
    echo "6. Clique em 'Generate token'"
    echo "7. COPIE o token (começa com ghp_)"
    echo ""
    read -p "Pressione Enter quando tiver o token pronto..."
    echo ""
    echo "🚀 Executando push..."
    echo "Quando solicitado:"
    echo "  Username: Teco-Bortolatto"
    echo "  Password: Cole o token (não sua senha!)"
    echo ""
    git push origin main
    
elif [[ "$REMOTE_URL" == *"git@"* ]]; then
    echo "🔐 Método de autenticação: SSH"
    echo ""
    echo "🚀 Executando push..."
    git push origin main
else
    echo "❌ Remote URL não reconhecido: $REMOTE_URL"
    exit 1
fi

# Verificar resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push realizado com sucesso!"
    echo ""
    echo "🔗 Verifique em: https://github.com/Teco-Bortolatto/MoWi"
    echo ""
    echo "🎯 Próximo passo: Conectar ao Vercel"
    echo "   1. Acesse: https://vercel.com/login"
    echo "   2. Login com GitHub"
    echo "   3. 'Add New Project'"
    echo "   4. Importe: Teco-Bortolatto/MoWi"
else
    echo ""
    echo "❌ Push falhou"
    echo ""
    echo "💡 Possíveis soluções:"
    echo "   1. Verifique se o token está correto"
    echo "   2. Verifique se o token tem permissão 'repo'"
    echo "   3. Tente criar um novo token"
    echo "   4. Consulte: COMO_FAZER_PUSH.md"
fi
