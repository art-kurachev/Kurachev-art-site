# Правила Дизайн-Системы - Мобильное Приложение Planet (Flutter)

> **Статус**: Документация с реальными цветовыми токенами
> **Последнее обновление**: 26 января 2026
> **Framework**: Flutter 3.x
> **Figma дизайн**: [Planet Mobile App](https://www.figma.com/design/ObxjfzMRKkNsshVJROr2RZ/Planet%D0%B0-Mobile-App.?node-id=5343-21285&m=dev)

## Содержание
1. [Определения токенов](#определения-токенов)
2. [Библиотека компонентов](#библиотека-компонентов)
3. [Фреймворки и библиотеки](#фреймворки-и-библиотеки)
4. [Управление ассетами](#управление-ассетами)
5. [Система иконок](#система-иконок)
6. [Подход к стилизации](#подход-к-стилизации)
7. [Структура проекта](#структура-проекта)
8. [Руководство по интеграции с Figma](#руководство-по-интеграции-с-figma)

---

## Определения токенов

### Цвета
**Расположение**: `Planet.Light.tokens.json` и `Planet.Dark.tokens.json`
**Формат**: Design Tokens Community Group (DTCG) format
**Тем**: 2 (Light и Dark)

```typescript
// Структура цветовых токенов Planet Mobile App
export const colors = {
  // Чистые цвета (Pure Colors)
  pureColor: {
    white: '#FFFFFF',
    dark: '#1E212B',
    secTextMessage2: '#2E3345',
    secTextMessage: '#616F9E',
    myMessage: '#EAF7F0',
    brandLight: '#DBE7FB',
    brandSecondary: '#94B7F4',
    brandDark: '#4B6CCD',
    redDark: '#C74952',
    redLight: '#FDEFEF',
  },
  
  // Контролы (Кнопки, интерактивные элементы)
  control: {
    light: {
      primary: '#1E212B',      // Основная кнопка
      secondary: '#EEF3FE',    // Второстепенная кнопка
      tertiary: '#1E212B',     // Третичная кнопка
      accept: '#6788EC',       // Подтверждение
      success: '#27AE60',      // Успех
      danger: '#EB5757',       // Опасность
      chat: '#FFB22B',         // Чат
    },
    dark: {
      primary: '#F6F8FF',
      secondary: '#2C3560',
      tertiary: '#6788EC',
      accept: '#6788EC',
      success: '#27AE60',
      danger: '#EB5757',
      chat: '#FFB22B',
    }
  },
  
  // Текст
  text: {
    light: {
      primary: '#2E3345',      // Основной текст
      secondary: '#616F9E',    // Второстепенный текст
      tertiary: '#909ABB',     // Третичный текст
      inverse: '#FFFFFF',      // Инверсный (на темном фоне)
      mute: '#DBE7FB',         // Приглушенный
    },
    dark: {
      primary: '#F6F8FF',
      secondary: '#A1AED3',
      tertiary: '#727DA6',
      inverse: '#1E212B',
      mute: '#8E97B8',
    }
  },
  
  // Поверхности (Фоны)
  surface: {
    light: {
      primary: '#FFFFFF',      // Основной фон
      card: '#FFFFFF',         // Фон карточки
      input: '#F4F6FA',        // Фон поля ввода
      tabTop: '#94B7F4',       // Верхняя часть таба
      bgTab: '#6788EC',        // Фон таба
    },
    dark: {
      primary: '#1E212B',
      card: '#2D3243',
      input: '#242836',
      tabTop: '#2E3345',
      bgTab: '#1E212B',
    }
  },
  
  // Границы
  border: {
    light: {
      default: '#E9EDF4',      // Обычная граница
      input: '#1E212B',        // Граница поля ввода
      inverse: '#2E3345',      // Инверсная граница
    },
    dark: {
      default: '#3B4259',
      input: '#434B6A',
      inverse: '#E9EDF4',
    }
  },
  
  // Разделители
  divider: {
    light: {
      default: '#E9EDF4',
    },
    dark: {
      default: '#3B4259',
    }
  },
  
  // Бренд
  brand: {
    light: {
      primary: '#6788EC',      // Основной цвет бренда
      soft: '#94B7F4',         // Мягкий оттенок
    },
    dark: {
      primary: '#6788EC',
      soft: '#2C3560',
    }
  },
  
  // Статусы
  status: {
    light: {
      success: '#27AE60',      // Успех
      successBg: '#EAF7F0',    // Фон успеха
      error: '#EB5757',        // Ошибка
      errorBg: '#FDEFEF',      // Фон ошибки
      warning: '#FFB22B',      // Предупреждение
      warningBg: '#FFF8EA',    // Фон предупреждения
      violet: '#7460EE',       // Фиолетовый
      violetBg: '#F2F0FE',     // Фон фиолетовый
    },
    dark: {
      success: '#27AE60',
      successBg: '#153325',
      error: '#EB5757',
      errorBg: '#472B33',
      warning: '#FFB22B',
      warningBg: '#3A2C14',
      violet: '#7460EE',
      violetBg: '#353754',
    }
  },
  
  // Градиенты фона
  bgGradient: {
    light: {
      start: '#6788EC',        // Начало градиента
      end: '#B9C8F5',          // Конец градиента
      transparent: '#B9C8F5',  // Прозрачный переход
    },
    dark: {
      start: '#17181C',
      end: '#212229',
      transparent: '#212229',
    }
  },
};
```

#### Использование цветов в коде

```typescript
// React Native пример
import { colors } from '@/theme/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.light.primary,
  },
  text: {
    color: colors.text.light.primary,
  },
  button: {
    backgroundColor: colors.control.light.accept,
  },
});

// С поддержкой темы
const ThemedComponent = () => {
  const { theme } = useTheme(); // 'light' или 'dark'
  
  return (
    <View style={{ backgroundColor: colors.surface[theme].primary }}>
      <Text style={{ color: colors.text[theme].primary }}>
        Текст с учетом темы
      </Text>
    </View>
  );
};
```

---

## Визуальная цветовая палитра Planet

### 🎨 Основные цвета бренда (Brand Colors)

| Название | Light Theme | Dark Theme | Использование |
|----------|-------------|------------|---------------|
| Primary | `#6788EC` | `#6788EC` | Основной цвет бренда, акценты, активные элементы |
| Soft | `#94B7F4` | `#2C3560` | Мягкие акценты, фоны второстепенных элементов |

### 📝 Цвета текста (Text Colors)

| Название | Light Theme | Dark Theme | Применение |
|----------|-------------|------------|------------|
| Primary | `#2E3345` | `#F6F8FF` | Основной текст, заголовки |
| Secondary | `#616F9E` | `#A1AED3` | Вторичный текст, подписи |
| Tertiary | `#909ABB` | `#727DA6` | Неактивный текст, плейсхолдеры |
| Inverse | `#FFFFFF` | `#1E212B` | Текст на контрастном фоне (кнопки, баннеры) |
| Mute | `#DBE7FB` | `#8E97B8` | Приглушенный текст, хинты |

### 🎯 Контролы (Control Colors)

| Название | Light Theme | Dark Theme | Назначение |
|----------|-------------|------------|------------|
| Primary | `#1E212B` | `#F6F8FF` | Основная кнопка (CTA) |
| Secondary | `#EEF3FE` | `#2C3560` | Второстепенная кнопка |
| Tertiary | `#1E212B` | `#6788EC` | Третичная кнопка, иконки |
| Accept | `#6788EC` | `#6788EC` | Подтверждение действия |
| Success | `#27AE60` | `#27AE60` | Успешное действие |
| Danger | `#EB5757` | `#EB5757` | Опасное/удаление действие |
| Chat | `#FFB22B` | `#FFB22B` | Чат, сообщения, уведомления |

### 🏠 Поверхности (Surface Colors)

| Название | Light Theme | Dark Theme | Использование |
|----------|-------------|------------|---------------|
| Primary | `#FFFFFF` | `#1E212B` | Основной фон приложения |
| Card | `#FFFFFF` | `#2D3243` | Карточки, контейнеры с содержимым |
| Input | `#F4F6FA` | `#242836` | Поля ввода, текстовые области |
| Tab Top | `#94B7F4` | `#2E3345` | Верхняя часть вкладки/таба |
| Tab BG | `#6788EC` | `#1E212B` | Фон активной вкладки |

### ⚠️ Статусы (Status Colors)

| Статус | Light Theme | Dark Theme | Контекст |
|--------|-------------|------------|----------|
| Success | `#27AE60` | `#27AE60` | Успешная операция |
| Success BG | `#EAF7F0` | `#153325` | Фон уведомления об успехе |
| Error | `#EB5757` | `#EB5757` | Ошибка, критическое состояние |
| Error BG | `#FDEFEF` | `#472B33` | Фон уведомления об ошибке |
| Warning | `#FFB22B` | `#FFB22B` | Предупреждение |
| Warning BG | `#FFF8EA` | `#3A2C14` | Фон предупреждения |
| Violet | `#7460EE` | `#7460EE` | Информация, дополнительный статус |
| Violet BG | `#F2F0FE` | `#353754` | Фон информационного блока |

### 🌈 Градиенты (Background Gradients)

**Light Theme:**
```css
background: linear-gradient(135deg, #6788EC 0%, #B9C8F5 100%);
```
- Start: `#6788EC`
- End: `#B9C8F5`

**Dark Theme:**
```css
background: linear-gradient(135deg, #17181C 0%, #212229 100%);
```
- Start: `#17181C`
- End: `#212229`

### 📏 Границы и разделители (Borders & Dividers)

| Тип | Light Theme | Dark Theme | Где использовать |
|-----|-------------|------------|------------------|
| Default Border | `#E9EDF4` | `#3B4259` | Обычные границы карточек, контейнеров |
| Input Border | `#1E212B` | `#434B6A` | Границы полей ввода в фокусе |
| Inverse Border | `#2E3345` | `#E9EDF4` | Инверсные границы на контрастном фоне |
| Divider | `#E9EDF4` | `#3B4259` | Разделительные линии между секциями |

### 💡 Рекомендации по использованию цветов

#### Контраст и доступность
```typescript
// ✅ ПРАВИЛЬНО: Достаточный контраст
<Text style={{ color: colors.text.light.primary }}>  // #2E3345 на белом
  Хорошо читаемый текст
</Text>

// ❌ НЕПРАВИЛЬНО: Низкий контраст
<Text style={{ color: colors.text.light.tertiary }}>  // #909ABB на светлом
  Плохо читаемый текст
</Text>
```

#### Семантическое использование
```typescript
// ✅ ПРАВИЛЬНО: Семантические цвета для статусов
<Button 
  color={colors.control.light.success}  // Зеленый для подтверждения
  title="Сохранить"
/>

<Button 
  color={colors.control.light.danger}   // Красный для удаления
  title="Удалить"
/>

// ❌ НЕПРАВИЛЬНО: Неверное семантическое значение
<Button 
  color={colors.control.light.success}  // НЕ использовать зеленый для удаления!
  title="Удалить"
/>
```

#### Консистентность тем
```typescript
// ✅ ПРАВИЛЬНО: Использование системы тем
const { theme } = useTheme();

<View style={{ 
  backgroundColor: colors.surface[theme].card,
  borderColor: colors.border[theme].default,
}}>
  <Text style={{ color: colors.text[theme].primary }}>
    Контент адаптируется к теме
  </Text>
</View>

// ❌ НЕПРАВИЛЬНО: Хардкод значений
<View style={{ 
  backgroundColor: '#FFFFFF',  // Не работает в темной теме
}}>
  <Text style={{ color: '#2E3345' }}>
    Контент не адаптируется
  </Text>
</View>
```

#### Иерархия контента
```typescript
// ✅ ПРАВИЛЬНО: Правильная визуальная иерархия
<View>
  <Text style={{ 
    color: colors.text[theme].primary,      // Самый важный
    fontSize: 24,
    fontWeight: 'bold' 
  }}>
    Заголовок
  </Text>
  
  <Text style={{ 
    color: colors.text[theme].secondary,    // Менее важный
    fontSize: 16 
  }}>
    Описание
  </Text>
  
  <Text style={{ 
    color: colors.text[theme].tertiary,     // Наименее важный
    fontSize: 14 
  }}>
    Дополнительная информация
  </Text>
</View>
```

#### Состояния элементов
```typescript
// Пример кнопки с разными состояниями
const Button = ({ disabled, pressed }) => {
  const { theme } = useTheme();
  
  const getButtonColor = () => {
    if (disabled) return colors.text[theme].mute;
    if (pressed) return colors.brand[theme].primary;
    return colors.control[theme].accept;
  };
  
  return (
    <TouchableOpacity
      style={{ backgroundColor: getButtonColor() }}
      disabled={disabled}
    >
      <Text>Кнопка</Text>
    </TouchableOpacity>
  );
};
```

### Типографика
**Расположение**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

```typescript
// Пример структуры - Обновить с реальной реализацией
export const typography = {
  // Семейства шрифтов
  fontFamily: {
    primary: '[ИМЯ_ШРИФТА], sans-serif',
    secondary: '[ИМЯ_ШРИФТА], serif',
    mono: '[ИМЯ_ШРИФТА], monospace',
  },
  
  // Размеры шрифтов
  fontSize: {
    xs: '12px',    // 0.75rem
    sm: '14px',    // 0.875rem
    base: '16px',  // 1rem
    lg: '18px',    // 1.125rem
    xl: '20px',    // 1.25rem
    '2xl': '24px', // 1.5rem
    '3xl': '30px', // 1.875rem
    '4xl': '36px', // 2.25rem
    '5xl': '48px', // 3rem
  },
  
  // Толщина шрифта
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Высота строки
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Межбуквенное расстояние
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};
```

### Отступы
**Расположение**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

```typescript
// Пример структуры - Обновить с реальной реализацией
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};
```

### Контрольные точки (Breakpoints)
**Расположение**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

```typescript
// Пример структуры - Обновить с реальной реализацией
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

### Радиус границ
**Расположение**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

```typescript
// Пример структуры - Обновить с реальной реализацией
export const borderRadius = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
};
```

### Тени
**Расположение**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

```typescript
// Пример структуры - Обновить с реальной реализацией
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};
```

### Трансформация токенов
**Система**: Design Tokens Community Group (DTCG) format
**Инструменты для использования**: Style Dictionary, Figma Tokens Plugin

#### Формат исходных токенов

Токены хранятся в формате DTCG со следующей структурой:

```json
{
  "tokenName": {
    "$type": "color",
    "$value": {
      "colorSpace": "srgb",
      "components": [1, 1, 1],
      "alpha": 1,
      "hex": "#FFFFFF"
    },
    "$extensions": {
      "com.figma.variableId": "VariableID:5204:11530",
      "com.figma.scopes": ["ALL_SCOPES"]
    }
  }
}
```

#### Рекомендуемая структура TypeScript типов

```typescript
// types/theme.ts

export type ThemeMode = 'light' | 'dark';

export interface ColorToken {
  light: string;
  dark: string;
}

export interface ThemeColors {
  pureColor: {
    white: string;
    dark: string;
    secTextMessage2: string;
    secTextMessage: string;
    myMessage: string;
    brandLight: string;
    brandSecondary: string;
    brandDark: string;
    redDark: string;
    redLight: string;
  };
  control: {
    primary: ColorToken;
    secondary: ColorToken;
    tertiary: ColorToken;
    accept: ColorToken;
    success: ColorToken;
    danger: ColorToken;
    chat: ColorToken;
  };
  text: {
    primary: ColorToken;
    secondary: ColorToken;
    tertiary: ColorToken;
    inverse: ColorToken;
    mute: ColorToken;
  };
  surface: {
    primary: ColorToken;
    card: ColorToken;
    input: ColorToken;
    tabTop: ColorToken;
    bgTab: ColorToken;
  };
  border: {
    default: ColorToken;
    input: ColorToken;
    inverse: ColorToken;
  };
  divider: {
    default: ColorToken;
  };
  brand: {
    primary: ColorToken;
    soft: ColorToken;
  };
  status: {
    success: ColorToken;
    successBg: ColorToken;
    error: ColorToken;
    errorBg: ColorToken;
    warning: ColorToken;
    warningBg: ColorToken;
    violet: ColorToken;
    violetBg: ColorToken;
  };
  bgGradient: {
    start: ColorToken;
    end: ColorToken;
    transparent: ColorToken;
  };
}

// Хелпер для получения цвета по теме
export function getColor(colorToken: ColorToken, theme: ThemeMode): string {
  return colorToken[theme];
}
```

#### Скрипт трансформации токенов

```javascript
// scripts/transformTokens.js
const fs = require('fs');

function transformTokens(inputPath, outputPath) {
  const tokens = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const transformed = {};
  
  function processCategory(obj, category) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      
      if (value.$value && value.$value.hex) {
        result[key] = value.$value.hex;
      } else if (typeof value === 'object') {
        result[key] = processCategory(value, key);
      }
    }
    return result;
  }
  
  for (const [category, values] of Object.entries(tokens)) {
    if (!category.startsWith('$')) {
      transformed[category] = processCategory(values, category);
    }
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2));
}

// Использование
transformTokens('Planet.Light.tokens.json', 'src/theme/colors.light.json');
transformTokens('Planet.Dark.tokens.json', 'src/theme/colors.dark.json');
```

---

## Библиотека компонентов

### Расположение компонентов
**Базовый путь**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Типичные места для проверки:
- `/src/components`
- `/components`
- `/lib/components`
- `/packages/ui`

### Архитектура компонентов
**Паттерн**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные паттерны:
- **Atomic Design**: atoms → molecules → organisms → templates → pages
- **Feature-based**: компоненты организованы по функциям/доменам
- **Layered**: ui → business → page компоненты

### Пример структуры компонента

```typescript
// [ТРЕБУЕТСЯ АНАЛИЗ] - Пример шаблона
import React from 'react';
import styles from './Button.module.css'; // или styled-components и т.д.

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  children,
  onClick,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Документация компонентов
**Система**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Проверить наличие:
- Storybook
- Styleguidist
- Docusaurus
- Пользовательская документация

### Соглашение об именовании компонентов
**Паттерн**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные соглашения:
- PascalCase для компонентов: `Button`, `InputField`, `NavigationBar`
- kebab-case для файлов: `button.tsx`, `input-field.tsx`
- Префиксные паттерны: `Base*`, `UI*`, `App*`

---

## Фреймворки и библиотеки

### UI фреймворк
**Фреймворк**: Flutter 3.x

**Используемые пакеты**:
- `flutter/material.dart` - Material Design 3
- `flutter/cupertino.dart` - iOS-стиль (опционально)

**Рекомендуемые дополнительные пакеты**:
```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Управление состоянием
  provider: ^6.1.1          # или
  flutter_riverpod: ^2.4.9  # или
  flutter_bloc: ^8.1.3
  
  # Навигация
  go_router: ^13.0.0
  
  # Хранение данных
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  
  # Сеть
  dio: ^5.4.0
  http: ^1.1.2
```

### Управление состоянием
**Библиотека**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные варианты:
- Redux / Redux Toolkit
- MobX
- Zustand
- Recoil
- Context API + useReducer
- Jotai

### Библиотека стилизации
**Система**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Для React Native:
- StyleSheet (нативный)
- Styled Components
- Emotion
- Tamagui
- NativeWind

Для React Web:
- CSS Modules
- Styled Components
- Emotion
- Tailwind CSS
- Chakra UI
- Material-UI

### Система сборки
**Бандлер**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Проверить наличие:
- Metro (React Native)
- Vite
- Webpack
- esbuild
- Rollup
- Expo (для React Native)

### Менеджер пакетов
**Менеджер**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Определить по lock-файлам:
- `package-lock.json` → npm
- `yarn.lock` → Yarn
- `pnpm-lock.yaml` → pnpm
- `bun.lockb` → Bun

---

## Управление ассетами

### Структура директории ассетов
**Расположение**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные паттерны:
```
/assets
  /images
    /icons
    /logos
    /illustrations
  /videos
  /fonts
  /animations
```

или

```
/public
  /images
  /videos
/src/assets
  /icons
  /fonts
```

### Ссылки на ассеты
**Метод**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Пример React Native:
```typescript
// Прямой импорт
import logo from '@/assets/images/logo.png';

// Использование require
<Image source={require('@/assets/images/logo.png')} />

// Удаленные изображения
<Image source={{ uri: 'https://cdn.example.com/image.png' }} />
```

Пример Web:
```typescript
// Импорт
import logo from '@/assets/images/logo.png';

// Папка public
<img src="/images/logo.png" alt="Logo" />

// CSS
background-image: url('/images/bg.png');
```

### Оптимизация ассетов
**Техники**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Проверить наличие:
- Плагины оптимизации изображений (imagemin, sharp)
- Генерация адаптивных изображений
- Конвертация в WebP/AVIF
- Реализация ленивой загрузки
- Прогрессивная загрузка изображений

### Конфигурация CDN
**Провайдер**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные провайдеры:
- Cloudflare
- AWS CloudFront
- Vercel Edge Network
- Fastly
- imgix (для изображений)

---

## Система иконок

### Библиотека иконок
**Библиотека**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные библиотеки:
- React Native Vector Icons
- @expo/vector-icons
- react-icons
- Heroicons
- Lucide
- Feather Icons
- Material Icons
- Font Awesome

### Расположение хранилища иконок
**Путь**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Типичные места:
- `/assets/icons`
- `/src/icons`
- `/components/icons`
- `/public/icons` (для SVG)

### Паттерн использования иконок

```typescript
// [ТРЕБУЕТСЯ АНАЛИЗ] - Примеры паттернов

// Паттерн 1: На основе компонентов
import { HomeIcon, UserIcon, SettingsIcon } from '@/icons';
<HomeIcon size={24} color="#000" />

// Паттерн 2: На основе имени
import Icon from '@/components/Icon';
<Icon name="home" size={24} color="#000" />

// Паттерн 3: Импорт SVG
import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';
<HomeIcon width={24} height={24} />

// Паттерн 4: Библиотека иконок
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="home" size={24} color="black" />
```

### Соглашение об именовании иконок
**Паттерн**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные соглашения:
- kebab-case: `home-icon.svg`, `user-profile.svg`
- PascalCase: `HomeIcon.svg`, `UserProfile.svg`
- С префиксом: `ic-home.svg`, `icon-user.svg`

### Размеры иконок
**Стандартизированные размеры**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенная шкала размеров:
- xs: 12px
- sm: 16px
- md: 20px
- lg: 24px
- xl: 32px
- 2xl: 48px

---

## Подход к стилизации

### CSS методология
**Подход**: Flutter Widget Styling с Material Design 3

Flutter использует декларативный подход к UI, где стили определяются непосредственно в виджетах или через ThemeData.

### Flutter Styling Examples

```dart
// 1. Inline стили
Container(
  decoration: BoxDecoration(
    color: context.colors.surfacePrimary,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(
      color: context.colors.borderDefault,
      width: 1,
    ),
  ),
  padding: const EdgeInsets.all(16),
  child: Text(
    'Заголовок',
    style: TextStyle(
      color: context.colors.textPrimary,
      fontSize: 20,
      fontWeight: FontWeight.w600,
    ),
  ),
)

// 2. Использование Theme
Text(
  'Текст',
  style: Theme.of(context).textTheme.bodyLarge,
)

ElevatedButton(
  style: Theme.of(context).elevatedButtonTheme.style,
  onPressed: () {},
  child: Text('Кнопка'),
)

// 3. Кастомные стили через extension
extension CustomTextStyles on BuildContext {
  TextStyle get heading1 => TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: colors.textPrimary,
  );
  
  TextStyle get body => TextStyle(
    fontSize: 16,
    color: colors.textPrimary,
  );
}

// Использование
Text('Заголовок', style: context.heading1)

// 4. Переиспользуемые стили
class AppTextStyles {
  static TextStyle heading1(BuildContext context) => TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: context.colors.textPrimary,
  );
  
  static TextStyle body(BuildContext context) => TextStyle(
    fontSize: 16,
    color: context.colors.textPrimary,
  );
}

// 5. Styled компоненты
class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const PrimaryButton({
    required this.text,
    required this.onPressed,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: colors.controlAccept,
        foregroundColor: colors.textInverse,
        padding: const EdgeInsets.symmetric(
          horizontal: 24,
          vertical: 16,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      onPressed: onPressed,
      child: Text(text),
    );
  }
}
```

### Пример CSS Modules
```typescript
// [ТРЕБУЕТСЯ АНАЛИЗ]
// Component.tsx
import styles from './Component.module.css';

export const Component = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Заголовок</h1>
  </div>
);

// Component.module.css
.container {
  padding: var(--spacing-4);
  background: var(--color-background);
}

.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}
```

### Пример Styled Components
```typescript
// [ТРЕБУЕТСЯ АНАЛИЗ]
import styled from 'styled-components';

export const Container = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background};
`;

export const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;
```

### Пример React Native StyleSheet
```typescript
// [ТРЕБУЕТСЯ АНАЛИЗ]
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

### Глобальные стили
**Расположение**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные места:
- `/src/styles/global.css`
- `/src/styles/index.css`
- `/styles/globals.css`
- `App.css` или `index.css`

### Система тем
**Реализация**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Проверить наличие:
- Темизация на основе контекста
- CSS переменные
- Компонент провайдера темы
- Поддержка темного режима

```typescript
// Пример структуры провайдера темы
// [ТРЕБУЕТСЯ АНАЛИЗ]
import { ThemeProvider } from 'styled-components';
// или
import { ThemeProvider } from '@/contexts/ThemeContext';

const theme = {
  colors: { /* ... */ },
  spacing: { /* ... */ },
  typography: { /* ... */ },
};

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### Реализация адаптивного дизайна
**Метод**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные подходы:
```css
/* Медиа-запросы */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Контейнерные запросы */
@container (min-width: 400px) {
  .card {
    display: grid;
  }
}
```

```typescript
// React Native адаптивность
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
```

---

## Структура проекта

### Организация директорий
**Паттерн**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные структуры:

#### Структура на основе функций
```
/src
  /features
    /auth
      /components
      /hooks
      /api
      /types
    /dashboard
      /components
      /hooks
      /api
      /types
  /shared
    /components
    /hooks
    /utils
  /assets
  /styles
```

#### Слоистая структура
```
/src
  /components
    /ui          # Базовые компоненты
    /common      # Общие компоненты
    /features    # Специфичные для функций
  /screens       # Компоненты экранов/страниц
  /navigation    # Конфигурация навигации
  /services      # API сервисы
  /hooks         # Пользовательские хуки
  /utils         # Утилитарные функции
  /types         # TypeScript типы
  /constants     # Константы
  /assets        # Статические ассеты
```

### Соглашения об именовании файлов
**Паттерн**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Распространенные соглашения:
- Компоненты: `PascalCase.tsx` (например, `Button.tsx`)
- Утилиты: `camelCase.ts` (например, `formatDate.ts`)
- Хуки: `useCamelCase.ts` (например, `useAuth.ts`)
- Типы: `PascalCase.types.ts` или `types.ts`
- Константы: `SCREAMING_SNAKE_CASE` или `camelCase.constants.ts`

### Алиасы импорта
**Конфигурация**: `[ТРЕБУЕТСЯ АНАЛИЗ]`

Проверить `tsconfig.json` или `babel.config.js`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@assets/*": ["./src/assets/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

Использование:
```typescript
// Вместо: import Button from '../../../components/Button';
import Button from '@/components/Button';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@utils/date';
```

---

## Руководство по интеграции с Figma

### Рабочий процесс от дизайна к коду

#### 1. Извлечение токенов
При извлечении дизайн-токенов из Figma:

```typescript
// Извлечение цветов из стилей Figma
// [ТРЕБУЕТСЯ АНАЛИЗ] - Сопоставление стилей цветов Figma с токенами кода
// Пример сопоставления:
// Figma: "Primary/Main" → Код: colors.primary.main
// Figma: "Text/Primary" → Код: colors.text.primary
```

#### 2. Сопоставление компонентов
Сопоставление компонентов Figma с компонентами кода:

| Компонент Figma | Компонент кода | Примечания |
|-----------------|----------------|------------|
| [ТРЕБУЕТСЯ СОПОСТАВЛЕНИЕ] | [ТРЕБУЕТСЯ СОПОСТАВЛЕНИЕ] | [ТРЕБУЕТСЯ АНАЛИЗ] |

#### 3. Система отступов
Согласование Auto Layout из Figma с отступами в коде:

```typescript
// [ТРЕБУЕТСЯ АНАЛИЗ]
// Figma padding: 16px → Код: spacing[4] или theme.spacing(2)
// Figma gap: 8px → Код: spacing[2] или theme.spacing(1)
```

#### 4. Сопоставление типографики
Сопоставление текстовых стилей Figma с кодом:

```typescript
// [ТРЕБУЕТСЯ АНАЛИЗ]
// Пример сопоставления:
// Figma: "Heading 1" → Код: typography.h1 или компонент <H1>
// Figma: "Body Regular" → Код: typography.body или компонент <Text>
```

#### 5. Варианты компонентов
Обработка вариантов компонентов Figma:

```typescript
// [ТРЕБУЕТСЯ АНАЛИЗ]
// Варианты Figma → Сопоставление пропсов
// Пример:
// Вариант: "Type=Primary, Size=Large"
// Пропсы: type="primary" size="lg"
```

### Чек-лист передачи дизайна

При получении дизайнов из Figma:

- [ ] Проверить, что все цвета существуют в дизайн-токенах
- [ ] Проверить, что все текстовые стили сопоставлены с токенами типографики
- [ ] Проверить, что значения отступов соответствуют шкале отступов
- [ ] Определить необходимые новые компоненты
- [ ] Проверить контрольные точки адаптивности
- [ ] Проверить доступность иконок
- [ ] Проверить наличие анимаций/переходов
- [ ] Просмотреть требования к доступности
- [ ] Подтвердить настройки экспорта ассетов
- [ ] Документировать любые отклонения от дизайн-системы

### Интеграция с Figma Dev Mode

При использовании Figma Dev Mode:
- [ ] Настроить предпочтения генерации кода
- [ ] Настроить сопоставление компонентов
- [ ] Настроить сопоставление токенов
- [ ] Настроить расширение VS Code (если доступно)
- [ ] Настроить автоматизацию синхронизации дизайна

---

## Следующие шаги

Для завершения этой документации дизайн-системы:

1. **Предоставить доступ к кодовой базе**: Предоставьте доступ к директории проекта, чтобы я мог проанализировать:
   - Фактическую структуру файлов
   - Зависимости пакетов
   - Реализации компонентов
   - Паттерны стилизации
   - Конфигурацию сборки

2. **Просмотреть дизайн Figma**: Проанализировать конкретные компоненты и паттерны в файле Figma Planet Mobile App

3. **Создать конкретные сопоставления**: Создать точные сопоставления между Figma и кодом

4. **Документировать текущие паттерны**: Задокументировать фактические паттерны, используемые в кодовой базе

5. **Создать план миграции**: При необходимости создать план согласования кода с дизайн-системой

### Команды для выполнения после получения доступа к кодовой базе

```bash
# Анализ package.json для фреймворков/библиотек
cat package.json

# Поиск файлов компонентов
find . -name "*.tsx" -o -name "*.jsx" | head -20

# Поиск файлов стилей
find . -name "*.css" -o -name "*.scss" -o -name "*.styled.*"

# Поиск файлов токенов/темы
find . -name "*theme*" -o -name "*token*" -o -name "*constant*"

# Проверка использования иконок
grep -r "Icon" --include="*.tsx" --include="*.jsx" | head -10

# Поиск директорий ассетов
find . -type d -name "assets" -o -name "images" -o -name "icons"
```

---

## Дополнительные ресурсы

### Документация для создания/обновления
- Документация библиотеки компонентов
- Документация дизайн-токенов
- Руководство по стилю
- Руководство по участию в разработке
- Чек-лист code review

### Инструменты для рассмотрения
- **Figma Tokens**: Для автоматизированной синхронизации токенов
- **Storybook**: Для документации компонентов
- **Chromatic**: Для визуального регрессионного тестирования
- **Style Dictionary**: Для трансформации токенов
- **Design Lint**: Для контроля качества файлов Figma

### Точки интеграции MCP
- Автоматизированное извлечение компонентов из Figma
- Синхронизация дизайн-токенов
- Генерация компонентов из Figma
- Валидация стилей
- Пайплайн оптимизации ассетов

---

**Статус документа**: 🚧 Шаблон - Ожидается анализ кодовой базы

Чтобы продолжить, пожалуйста, предоставьте доступ к вашей кодовой базе или поделитесь конкретными файлами/директориями, которые вы хотите, чтобы я проанализировал.
