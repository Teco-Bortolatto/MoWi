#!/bin/bash

# Script para fazer push com autenticação interativa
# Este script ajuda a fazer push quando há necessidade de autenticação

echo "🚀 Preparando push para GitHub..."
echo ""
echo "📋 Status atual:"
git status -sb
echo ""
echo "📤 Commits prontos para push:"
git log origin/main..HEAD --oneline
echo ""
echo "⚠️  Você precisará autenticar:"
echo "   - Username: seu usuário do GitHub"
echo "   - Password: use um Personal Access Token (não sua senha)"
echo ""
echo "   Para criar um token: https://github.com/settings/tokens"
echo "   Permissões necessárias: repo"
echo ""
read -p "Pressione Enter para continuar com o push..."
echo ""

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push realizado com sucesso!"
    echo "🔗 Repositório: https://github.com/Teco-Bortolatto/MoWi"
else
    echo ""
    echo "❌ Push falhou. Verifique suas credenciais."
    echo ""
    echo "💡 Alternativas:"
    echo "   1. Configurar SSH (mais seguro):"
    echo "      ssh-keygen -t ed25519 -C 'seu-email@exemplo.com'"
    echo "      # Depois adicione a chave em: https://github.com/settings/keys"
    echo ""
    echo "   2. Usar GitHub CLI:"
    echo "      brew install gh"
    echo "      gh auth login"
fi
