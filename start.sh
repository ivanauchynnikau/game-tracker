#!/bin/bash

echo "🎾 Tennis Match Tracker - Скрипт запуска"
echo "========================================="
echo ""

# Check if npm is working
if ! command -v npm &> /dev/null
then
    echo "❌ npm не найден или не работает"
    echo ""
    echo "Выберите вариант:"
    echo "1. Установить Node.js через nvm (рекомендуется)"
    echo "2. Запустить через Docker"
    echo "3. Выход"
    echo ""
    read -p "Введите номер (1-3): " choice
    
    case $choice in
        1)
            echo "Установка nvm и Node.js..."
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
            nvm install --lts
            nvm use --lts
            echo "✅ Node.js установлен!"
            ;;
        2)
            if ! command -v docker &> /dev/null
            then
                echo "❌ Docker не установлен"
                echo "Установите Docker: https://docs.docker.com/get-docker/"
                exit 1
            fi
            echo "Запуск через Docker..."
            docker-compose up -d
            echo "✅ Приложение запущено на http://localhost:3000"
            exit 0
            ;;
        3)
            exit 0
            ;;
        *)
            echo "Неверный выбор"
            exit 1
            ;;
    esac
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка установки зависимостей"
        echo "Попробуйте: docker-compose up -d"
        exit 1
    fi
fi

echo ""
echo "🚀 Запуск dev сервера..."
echo ""
npm run dev
