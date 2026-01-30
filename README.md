# AI Chat Widget

[![npm version](https://img.shields.io/npm/v/@joseantonionuevo/ai-chat-widget)](https://www.npmjs.com/package/@joseantonionuevo/ai-chat-widget)
[![license](https://img.shields.io/npm/l/@joseantonionuevo/ai-chat-widget)](https://github.com/JoseAntonioNuevo/ai-chat-widget/blob/main/LICENSE)

A **ready-to-use, fully customizable floating chat widget** for AI-powered applications. Built with React and designed to work seamlessly with the [Vercel AI SDK v6](https://ai-sdk.dev/).

## What is this?

AI Chat Widget is an open-source React component that adds a beautiful, functional chat interface to any web application. It's designed for developers who want to integrate AI chat capabilities (like GPT, Claude, or any LLM) into their apps without building the entire chat UI from scratch.

**Perfect for:**
- Customer support chatbots
- AI assistants embedded in SaaS products
- Documentation Q&A bots
- Any application that needs conversational AI

## Key Features

- **5 Beautiful Dark Themes** - Pre-built color schemes ready to use
- **Fully Customizable** - Override any color via props
- **Real-time Streaming** - Shows responses as they're generated
- **Markdown Support** - Renders formatted text, code blocks, lists
- **Context-Based Suggestions** - Clickable follow-up questions after AI responses
- **Restart Chat Button** - Clear conversation and start fresh from header
- **Smart Rate Limit Handling** - Auto-detects 429 errors with optional auto-retry
- **Lightweight** - ~15KB minified, lazy-loads heavy dependencies
- **Accessible** - Keyboard navigation, ARIA labels, screen reader support
- **Internationalization** - English and Spanish included, easy to extend
- **TypeScript** - Full type definitions included
- **Zero Config** - Works out of the box with sensible defaults

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Theme Presets](#theme-presets)
- [Customizing Colors](#customizing-colors)
- [All Customizable Props](#all-customizable-props)
- [Customizing Labels](#customizing-labels)
- [Rate Limit Handling](#rate-limit-handling)
- [Custom Icons](#custom-icons)
- [Backend Requirements](#backend-requirements)
- [Framework Integration](#framework-integration)
- [Advanced Usage](#advanced-usage)
- [TypeScript](#typescript)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
# npm
npm install @joseantonionuevo/ai-chat-widget

# pnpm
pnpm add @joseantonionuevo/ai-chat-widget

# yarn
yarn add @joseantonionuevo/ai-chat-widget
```

### Peer Dependencies

This package requires the following peer dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | `>=18.0.0` | UI framework |
| `react-dom` | `>=18.0.0` | DOM rendering |
| `@ai-sdk/react` | `>=3.0.0` | Chat hooks (`useChat`) |
| `ai` | `>=6.0.0` | Vercel AI SDK core |

Install them if not already in your project:

```bash
npm install react react-dom @ai-sdk/react ai
```

### Optional Dependencies (for Markdown)

For rich markdown rendering in assistant responses:

```bash
npm install react-markdown remark-gfm
```

If not installed, responses will render as plain text.

---

## Quick Start

```tsx
import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';

function App() {
  return (
    <div>
      <h1>My Application</h1>
      {/* The widget appears as a floating button */}
      <ChatWidget apiUrl="/api/chat" />
    </div>
  );
}
```

That's it! A floating chat button will appear in the bottom-right corner of your app.

---

## Theme Presets

The widget includes **5 professionally designed dark mode themes**. Each theme is carefully crafted with proper contrast ratios and visual hierarchy.

### Using a Theme Preset

```tsx
<ChatWidget apiUrl="/api/chat" theme="midnight" />
<ChatWidget apiUrl="/api/chat" theme="ocean" />
<ChatWidget apiUrl="/api/chat" theme="forest" />
<ChatWidget apiUrl="/api/chat" theme="sunset" />
<ChatWidget apiUrl="/api/chat" theme="lavender" />
```

---

### 1. Midnight (Default)

A sophisticated dark theme with **indigo accents**. Perfect for modern, professional applications.

```tsx
<ChatWidget apiUrl="/api/chat" theme="midnight" />
```

| Color Variable | Value | Description |
|----------------|-------|-------------|
| `primary` | `#6366f1` | Indigo - buttons, user bubbles |
| `primaryHover` | `#4f46e5` | Darker indigo for hover states |
| `background` | `#0f172a` | Slate 900 - main background |
| `surface` | `#1e293b` | Slate 800 - cards, input area |
| `surfaceHover` | `#334155` | Slate 700 - hover states |
| `text` | `#f1f5f9` | Slate 100 - primary text |
| `textSecondary` | `#94a3b8` | Slate 400 - muted text |
| `border` | `#334155` | Slate 700 - borders |
| `userBubble` | `#6366f1` | Indigo - user message background |
| `userBubbleText` | `#ffffff` | White - user message text |
| `assistantBubble` | `#1e293b` | Slate 800 - assistant background |
| `assistantBubbleText` | `#f1f5f9` | Slate 100 - assistant text |
| `error` | `#ef4444` | Red 500 - error text |
| `errorBg` | `#450a0a` | Red 950 - error background |

---

### 2. Ocean

A calming dark theme with **sky blue accents**. Great for productivity and communication apps.

```tsx
<ChatWidget apiUrl="/api/chat" theme="ocean" />
```

| Color Variable | Value | Description |
|----------------|-------|-------------|
| `primary` | `#0ea5e9` | Sky 500 - buttons, user bubbles |
| `primaryHover` | `#0284c7` | Sky 600 - hover states |
| `background` | `#0c1222` | Deep blue - main background |
| `surface` | `#172033` | Dark blue - cards, input area |
| `surfaceHover` | `#1e3a5f` | Navy - hover states |
| `text` | `#e0f2fe` | Sky 100 - primary text |
| `textSecondary` | `#7dd3fc` | Sky 300 - muted text |
| `border` | `#1e3a5f` | Navy - borders |
| `userBubble` | `#0ea5e9` | Sky 500 - user message background |
| `userBubbleText` | `#ffffff` | White - user message text |
| `assistantBubble` | `#172033` | Dark blue - assistant background |
| `assistantBubbleText` | `#e0f2fe` | Sky 100 - assistant text |

---

### 3. Forest

A nature-inspired dark theme with **green accents**. Ideal for wellness, eco, or nature-related apps.

```tsx
<ChatWidget apiUrl="/api/chat" theme="forest" />
```

| Color Variable | Value | Description |
|----------------|-------|-------------|
| `primary` | `#22c55e` | Green 500 - buttons, user bubbles |
| `primaryHover` | `#16a34a` | Green 600 - hover states |
| `background` | `#052e16` | Deep green - main background |
| `surface` | `#14532d` | Green 900 - cards, input area |
| `surfaceHover` | `#166534` | Green 800 - hover states |
| `text` | `#dcfce7` | Green 100 - primary text |
| `textSecondary` | `#86efac` | Green 300 - muted text |
| `border` | `#166534` | Green 800 - borders |
| `userBubble` | `#22c55e` | Green 500 - user message background |
| `userBubbleText` | `#052e16` | Deep green - user message text |
| `assistantBubble` | `#14532d` | Green 900 - assistant background |
| `assistantBubbleText` | `#dcfce7` | Green 100 - assistant text |

---

### 4. Sunset

A warm dark theme with **orange accents**. Perfect for creative, energetic, or entertainment apps.

```tsx
<ChatWidget apiUrl="/api/chat" theme="sunset" />
```

| Color Variable | Value | Description |
|----------------|-------|-------------|
| `primary` | `#f97316` | Orange 500 - buttons, user bubbles |
| `primaryHover` | `#ea580c` | Orange 600 - hover states |
| `background` | `#1c1917` | Stone 900 - main background |
| `surface` | `#292524` | Stone 800 - cards, input area |
| `surfaceHover` | `#44403c` | Stone 700 - hover states |
| `text` | `#fafaf9` | Stone 50 - primary text |
| `textSecondary` | `#d6d3d1` | Stone 300 - muted text |
| `border` | `#44403c` | Stone 700 - borders |
| `userBubble` | `#f97316` | Orange 500 - user message background |
| `userBubbleText` | `#ffffff` | White - user message text |
| `assistantBubble` | `#292524` | Stone 800 - assistant background |
| `assistantBubbleText` | `#fafaf9` | Stone 50 - assistant text |

---

### 5. Lavender

An elegant dark theme with **purple accents**. Great for luxury, creative, or design-focused apps.

```tsx
<ChatWidget apiUrl="/api/chat" theme="lavender" />
```

| Color Variable | Value | Description |
|----------------|-------|-------------|
| `primary` | `#a855f7` | Purple 500 - buttons, user bubbles |
| `primaryHover` | `#9333ea` | Purple 600 - hover states |
| `background` | `#1a0a2e` | Deep purple - main background |
| `surface` | `#2d1b4e` | Dark purple - cards, input area |
| `surfaceHover` | `#3b2d5c` | Purple - hover states |
| `text` | `#f3e8ff` | Purple 100 - primary text |
| `textSecondary` | `#d8b4fe` | Purple 300 - muted text |
| `border` | `#3b2d5c` | Purple - borders |
| `userBubble` | `#a855f7` | Purple 500 - user message background |
| `userBubbleText` | `#ffffff` | White - user message text |
| `assistantBubble` | `#2d1b4e` | Dark purple - assistant background |
| `assistantBubbleText` | `#f3e8ff` | Purple 100 - assistant text |

---

## Customizing Colors

You can create a completely custom theme by passing a theme object instead of a preset name.

### Required Colors (4 minimum)

At minimum, you must provide these 4 colors:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  theme={{
    primary: '#7bc7c1',      // Your brand color
    background: '#ffffff',   // Main background
    surface: '#f5f5f5',      // Cards, input area
    text: '#333333',         // Primary text
  }}
/>
```

### All Theme Color Options

For complete control, you can specify all 14 color variables:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  theme={{
    // Required colors
    primary: '#7bc7c1',           // Main accent color (buttons, highlights)
    background: '#ffffff',        // Chat window background
    surface: '#fdf4e0',           // Input area, assistant bubble background
    text: '#2d2d2d',              // Primary text color

    // Optional colors (auto-generated if not provided)
    primaryHover: '#5ba8a2',      // Primary color on hover (default: darker primary)
    surfaceHover: '#fefbf5',      // Surface color on hover (default: lighter surface)
    textSecondary: '#666666',     // Muted/secondary text (default: lighter text)
    border: '#e0e0e0',            // Border color (default: same as surface)
    userBubble: '#7bc7c1',        // User message background (default: primary)
    userBubbleText: '#ffffff',    // User message text (default: white)
    assistantBubble: '#fdf4e0',   // Assistant message background (default: surface)
    assistantBubbleText: '#2d2d2d', // Assistant message text (default: text)
    error: '#ef4444',             // Error text color (default: red)
    errorBg: '#fef2f2',           // Error background (default: light red)
  }}
/>
```

### Light Mode Example

Create a clean light theme:

```tsx
const lightTheme = {
  primary: '#2563eb',           // Blue 600
  background: '#ffffff',        // White
  surface: '#f8fafc',           // Slate 50
  surfaceHover: '#f1f5f9',      // Slate 100
  text: '#1e293b',              // Slate 800
  textSecondary: '#64748b',     // Slate 500
  border: '#e2e8f0',            // Slate 200
  userBubble: '#2563eb',        // Blue 600
  userBubbleText: '#ffffff',    // White
  assistantBubble: '#f1f5f9',   // Slate 100
  assistantBubbleText: '#1e293b', // Slate 800
  error: '#dc2626',             // Red 600
  errorBg: '#fef2f2',           // Red 50
};

<ChatWidget apiUrl="/api/chat" theme={lightTheme} />
```

### Brand Color Example

Match your brand colors:

```tsx
// Example: Teal brand with cream accents
const brandTheme = {
  primary: '#7bc7c1',           // Brand teal
  primaryHover: '#5ba8a2',      // Darker teal
  background: '#ffffff',        // White
  surface: '#fdf4e0',           // Cream
  surfaceHover: '#fefbf5',      // Light cream
  text: '#2d2d2d',              // Dark gray
  textSecondary: '#666666',     // Medium gray
  border: 'rgba(123, 199, 193, 0.3)', // Teal with opacity
  userBubble: '#7bc7c1',        // Teal
  userBubbleText: '#ffffff',    // White
  assistantBubble: '#fdf4e0',   // Cream
  assistantBubbleText: '#2d2d2d', // Dark gray
};

<ChatWidget apiUrl="/api/chat" theme={brandTheme} />
```

---

## All Customizable Props

Here's a complete reference of all props you can pass to `ChatWidget`:

### Core Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `apiUrl` | `string` | - | **Yes** | Your chat API endpoint URL |
| `theme` | `PresetName \| ThemeConfig` | `'midnight'` | No | Theme preset name or custom colors |
| `lang` | `string` | `'en'` | No | Language code (any: 'en', 'es', 'fr', 'de', etc.) |

### Appearance Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Widget position on screen |
| `width` | `string` | `'380px'` | Chat window width (CSS value) |
| `height` | `string` | `'500px'` | Chat window height (CSS value) |
| `zIndex` | `number` | `50` | CSS z-index for the widget |
| `className` | `string` | - | Additional CSS class for root container |
| `fontFamily` | `string` | `'Inter, system-ui, sans-serif'` | Custom font family (see [Fonts](#customizing-fonts)) |

### Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| false` | `'Chat Assistant'` | Chat window header title. Set to `''` or `false` to hide |
| `headerIcon` | `ReactNode` | - | Icon/image displayed left of the title (see [Header](#customizing-the-header)) |
| `placeholder` | `string` | `'Type your message...'` | Input field placeholder |
| `greeting` | `string` | - | Initial assistant message (optional) |
| `labels` | `Partial<Labels>` | - | Custom label overrides |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Start with chat window open |
| `showSuggestions` | `boolean` | `true` | Show clickable suggestion boxes below AI responses |
| `rateLimitOptions` | `RateLimitOptions` | `{ autoRetry: false }` | Rate limit error handling options (see [Rate Limit Handling](#rate-limit-handling)) |

### Resizing Props

The chat window is resizable by default. Users can drag any corner to resize.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resizable` | `boolean` | `true` | Enable user-resizable chat window |
| `minWidth` | `string` | `'300px'` | Minimum width constraint |
| `maxWidth` | `string` | `'600px'` | Maximum width constraint |
| `minHeight` | `string` | `'400px'` | Minimum height constraint |
| `maxHeight` | `string` | `'80vh'` | Maximum height constraint |

```tsx
// Disable resizing
<ChatWidget apiUrl="/api/chat" resizable={false} />

// Custom constraints
<ChatWidget
  apiUrl="/api/chat"
  width="400px"
  height="600px"
  minWidth="320px"
  maxWidth="800px"
  minHeight="300px"
  maxHeight="90vh"
/>
```

**Notes:**
- Resize is automatically disabled on mobile devices (< 640px width)
- User-set sizes are persisted in localStorage
- The `width` and `height` props set the initial/default size

### Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `CustomIcons` | - | Custom icons for the floating button |
| `icon.open` | `ReactNode` | Chat bubble | Icon when chat is closed |
| `icon.close` | `ReactNode` | X icon | Icon when chat is open |

### Usage Example with All Props

```tsx
<ChatWidget
  // Required
  apiUrl="https://api.example.com/chat"

  // Theme
  theme="ocean"

  // Language
  lang="es"

  // Appearance
  position="bottom-left"
  width="400px"
  height="600px"
  zIndex={100}
  className="my-chat-widget"

  // Content
  title="Asistente de Soporte"
  placeholder="Escribe tu pregunta..."
  greeting="¡Hola! ¿En qué puedo ayudarte hoy?"

  // Labels (partial override)
  labels={{
    thinking: 'Procesando',
    error: 'Error de conexión',
    retry: 'Intentar de nuevo',
  }}

  // Behavior
  defaultOpen={false}
/>
```

---

## Customizing Labels

The widget includes built-in labels for **English** (`en`) and **Spanish** (`es`). For any other language, provide your own labels via the `labels` prop.

The `lang` prop accepts any string and is sent to your backend API, allowing your server to respond in the appropriate language.

### Available Labels

| Label | English Default | Spanish Default | Description |
|-------|-----------------|-----------------|-------------|
| `title` | `'Chat Assistant'` | `'Asistente de Chat'` | Window header title |
| `placeholder` | `'Type your message...'` | `'Escribe tu mensaje...'` | Input placeholder |
| `send` | `'Send message'` | `'Enviar mensaje'` | Send button (accessibility) |
| `close` | `'Close chat'` | `'Cerrar chat'` | Close button (accessibility) |
| `open` | `'Open chat'` | `'Abrir chat'` | Open button (accessibility) |
| `thinking` | `'Thinking'` | `'Pensando'` | Loading indicator text |
| `error` | `'Something went wrong...'` | `'Algo salió mal...'` | Error message |
| `retry` | `'Retry'` | `'Reintentar'` | Retry button text |
| `suggestionsTitle` | `'Suggested questions'` | `'Preguntas sugeridas'` | Suggestions section title |
| `restart` | `'Restart chat'` | `'Reiniciar chat'` | Restart button (accessibility) |
| `rateLimitError` | `'Too many requests...'` | `'Demasiadas solicitudes...'` | Rate limit error message |
| `rateLimitRetryIn` | `'You can retry in'` | `'Puedes reintentar en'` | Retry countdown prefix |
| `autoRetrying` | `'Retrying in'` | `'Reintentando en'` | Auto-retry countdown prefix |
| `cancelAutoRetry` | `'Cancel'` | `'Cancelar'` | Cancel auto-retry button |

### Partial Override

Only override the labels you need:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  lang="en"
  labels={{
    title: 'Support Bot',
    thinking: 'Processing your request',
  }}
/>
```

### Full Custom Labels

```tsx
const customLabels = {
  title: 'Help Center',
  placeholder: 'Ask me anything...',
  send: 'Send',
  close: 'Close',
  open: 'Get Help',
  thinking: 'Looking up the answer',
  error: 'Connection lost. Please try again.',
  retry: 'Try Again',
  suggestionsTitle: 'You might also ask:',
  restart: 'Start Over',
};

<ChatWidget
  apiUrl="/api/chat"
  labels={customLabels}
/>
```

### Using Other Languages

For languages without built-in translations, provide all labels:

```tsx
// French
<ChatWidget
  apiUrl="/api/chat"
  lang="fr"
  labels={{
    title: 'Assistant',
    placeholder: 'Écrivez votre message...',
    send: 'Envoyer',
    close: 'Fermer',
    open: 'Ouvrir le chat',
    thinking: 'Réflexion',
    error: 'Une erreur est survenue',
    retry: 'Réessayer',
    suggestionsTitle: 'Questions suggérées',
    restart: 'Recommencer',
  }}
/>

// German
<ChatWidget
  apiUrl="/api/chat"
  lang="de"
  labels={{
    title: 'Assistent',
    placeholder: 'Nachricht eingeben...',
    send: 'Senden',
    close: 'Schließen',
    open: 'Chat öffnen',
    thinking: 'Denke nach',
    error: 'Ein Fehler ist aufgetreten',
    retry: 'Erneut versuchen',
    suggestionsTitle: 'Vorgeschlagene Fragen',
    restart: 'Neu starten',
  }}
/>

// Portuguese (Brazil)
<ChatWidget
  apiUrl="/api/chat"
  lang="pt-BR"
  labels={{
    title: 'Assistente',
    placeholder: 'Digite sua mensagem...',
    send: 'Enviar',
    close: 'Fechar',
    open: 'Abrir chat',
    thinking: 'Pensando',
    error: 'Algo deu errado',
    retry: 'Tentar novamente',
    suggestionsTitle: 'Perguntas sugeridas',
    restart: 'Reiniciar',
  }}
/>
```

### Shortcut Props

For the most common customizations, use the shortcut props:

```tsx
// These two are equivalent:
<ChatWidget title="Support" placeholder="Ask..." />
<ChatWidget labels={{ title: 'Support', placeholder: 'Ask...' }} />
```

---

## Custom Icons

The floating button icon is fully customizable. You can use any icon library or custom SVG.

### Using Lucide React

```tsx
import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';
import { MessageCircle, X } from 'lucide-react';

<ChatWidget
  apiUrl="/api/chat"
  icon={{
    open: <MessageCircle size={24} />,
    close: <X size={24} />,
  }}
/>
```

### Using Heroicons

```tsx
import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';

<ChatWidget
  apiUrl="/api/chat"
  icon={{
    open: <ChatBubbleLeftIcon className="w-6 h-6" />,
    close: <XMarkIcon className="w-6 h-6" />,
  }}
/>
```

### Using FontAwesome

```tsx
import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faXmark } from '@fortawesome/free-solid-svg-icons';

<ChatWidget
  apiUrl="/api/chat"
  icon={{
    open: <FontAwesomeIcon icon={faComments} size="lg" />,
    close: <FontAwesomeIcon icon={faXmark} size="lg" />,
  }}
/>
```

### Using Emoji or Text

```tsx
<ChatWidget
  apiUrl="/api/chat"
  icon={{
    open: '💬',
    close: '✕',
  }}
/>
```

### Using Custom SVG

```tsx
<ChatWidget
  apiUrl="/api/chat"
  icon={{
    open: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
  }}
/>
```

### Only Override One Icon

You can override just the open icon or just the close icon:

```tsx
// Only custom open icon, default close icon
<ChatWidget
  apiUrl="/api/chat"
  icon={{ open: <MyCustomIcon /> }}
/>
```

### Default Icons

The widget exports its default icons for reuse:

```tsx
import { ChatIcon, CloseIcon, SendIcon } from '@joseantonionuevo/ai-chat-widget';

// Use in your own components
<button><ChatIcon size={20} /></button>
```

---

## Customizing the Header

The chat window header can display an optional icon and/or title. Both are fully customizable and optional.

### Header with Icon and Title

```tsx
// With a logo image
<ChatWidget
  apiUrl="/api/chat"
  headerIcon={<img src="/logo.png" alt="Logo" style={{ width: 24, height: 24 }} />}
  title="Support Chat"
/>

// With an icon component (Lucide, Heroicons, etc.)
import { Bot } from 'lucide-react';

<ChatWidget
  apiUrl="/api/chat"
  headerIcon={<Bot size={20} color="white" />}
  title="AI Assistant"
/>

// With an emoji
<ChatWidget
  apiUrl="/api/chat"
  headerIcon="🤖"
  title="Chat with Us"
/>
```

### Icon Only (No Title)

Hide the title to show only the icon:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  headerIcon={<img src="/logo.png" alt="" style={{ width: 24, height: 24 }} />}
  title=""  // or title={false}
/>
```

### Title Only (No Icon)

The default behavior—just specify a title:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  title="Help Center"
/>
```

### Minimal Header (No Icon, No Title)

For a clean, minimal look with just the close button:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  title={false}
/>
```

### Using Next.js Image

```tsx
import Image from 'next/image';

<ChatWidget
  apiUrl="/api/chat"
  headerIcon={
    <Image
      src="/logo.png"
      width={24}
      height={24}
      alt="Company Logo"
    />
  }
  title="Support"
/>
```

### Header Icon Sizing

The header icon container is 24x24 pixels. Your icon or image will be centered within this space:

- **SVG icons**: Use `size={20}` or similar for best fit
- **Images**: Will be contained within 24x24; use CSS for exact sizing
- **Emoji**: Displayed at 1.25rem for good visibility

---

## Rate Limit Handling

The widget includes intelligent rate limit error detection and handling. When your API returns a 429 status or rate limit error, the widget automatically:

- Shows a specific "Too many requests" message instead of the generic error
- Displays a countdown timer showing when retry is available
- Optionally auto-retries with exponential backoff

### Basic Usage

By default, rate limit errors show a specific message with manual retry:

```tsx
// Rate limit messages are shown automatically, no config needed
<ChatWidget apiUrl="/api/chat" />
```

### Enable Auto-Retry

Enable automatic retry with exponential backoff:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  rateLimitOptions={{ autoRetry: true }}
/>
```

### Custom Retry Settings

Fine-tune the retry behavior:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  rateLimitOptions={{
    autoRetry: true,
    maxRetries: 5,        // Max retry attempts (default: 3)
    baseDelayMs: 2000,    // Initial delay in ms (default: 1000)
    maxDelayMs: 60000,    // Maximum delay cap in ms (default: 30000)
  }}
/>
```

### RateLimitOptions Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoRetry` | `boolean` | `false` | Enable automatic retry after rate limit |
| `maxRetries` | `number` | `3` | Maximum number of auto-retry attempts |
| `baseDelayMs` | `number` | `1000` | Base delay in milliseconds for exponential backoff |
| `maxDelayMs` | `number` | `30000` | Maximum delay cap in milliseconds |

### How It Works

1. **Error Detection**: The widget detects rate limits via:
   - HTTP status code 429
   - Error messages containing "rate limit", "too many requests", "quota exceeded", etc.
   - `Retry-After` header (if provided by your API)

2. **Countdown Timer**: Shows seconds until retry is available

3. **Exponential Backoff**: Each retry attempt doubles the wait time (with jitter):
   - Attempt 1: ~1 second
   - Attempt 2: ~2 seconds
   - Attempt 3: ~4 seconds
   - And so on, up to `maxDelayMs`

4. **Server Retry-After**: If your API includes a `Retry-After` header, the widget respects it

### Using the Utilities Directly

For advanced use cases, you can import the error classification utilities:

```tsx
import { classifyError, isRateLimitError } from '@joseantonionuevo/ai-chat-widget';

// Quick check
if (isRateLimitError(error)) {
  console.log('Rate limited!');
}

// Full classification
const errorInfo = classifyError(error);
if (errorInfo?.type === 'rate_limit') {
  console.log('Retry after:', errorInfo.retryAfterSeconds, 'seconds');
  console.log('HTTP status:', errorInfo.statusCode);
}
```

### Error Types

The classifier categorizes errors into these types:

| Type | Description |
|------|-------------|
| `rate_limit` | Too many requests (429 or matching message patterns) |
| `network` | Connection, timeout, or offline errors |
| `server` | Server errors (5xx status codes) |
| `auth` | Authentication/authorization errors (401, 403) |
| `generic` | All other errors |

---

## Context-Based Suggestions

The widget can display clickable follow-up questions below each AI response. When a user clicks a suggestion, it's automatically sent as their next message.

### How It Works

```
User: "What is your product about?"

AI: "Our product is an AI-powered wellness platform..."

┌─────────────────────────────────────────┐
│ 💡 Suggested questions:                 │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ What features does it include?      │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ How do I get started?               │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Is there a free trial?              │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Enabling/Disabling Suggestions

Suggestions are **enabled by default**. To disable them:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  showSuggestions={false}
/>
```

### Backend Requirements for Suggestions

For suggestions to appear, your backend must send them as a `data-suggestions` part in the streaming response. The widget looks for this data type in the message parts:

```typescript
// In your backend route handler
import { createUIMessageStream, createUIMessageStreamResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, lang } = await req.json();

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        model: yourModel,
        messages,
        async onFinish({ text }) {
          // Generate suggestions based on the response
          const suggestions = await generateSuggestions(text, lang);

          // Send suggestions as a data part
          if (suggestions.length > 0) {
            writer.write({
              type: 'data-suggestions',
              data: suggestions, // Array of 3 strings
            });
          }
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}

async function generateSuggestions(aiResponse: string, lang: string): Promise<string[]> {
  // Use your LLM to generate 3 follow-up questions
  // based on the AI's response
  return [
    "What features does it include?",
    "How do I get started?",
    "Is there a free trial?",
  ];
}
```

### Suggestion Styling

Suggestions automatically use your theme colors:
- **Background**: `surface` color
- **Text**: `text` color
- **Border**: `border` color
- **Hover**: `primary` color with white text

### i18n for Suggestions

The suggestions title ("Suggested questions") is included in the built-in translations:

| Language | Label |
|----------|-------|
| English | "Suggested questions" |
| Spanish | "Preguntas sugeridas" |

Override it via the `labels` prop:

```tsx
<ChatWidget
  apiUrl="/api/chat"
  labels={{
    suggestionsTitle: 'You might also ask:',
  }}
/>
```

---

## Customizing Fonts

### Default Font: Inter

The widget uses [Inter](https://fonts.google.com/specimen/Inter) as its default font—a modern, free, open-source typeface designed specifically for computer screens. Inter is:

- **Optimized for readability** at small sizes
- **Free and open-source** (SIL Open Font License)
- **Loaded automatically** from Google Fonts when the widget renders

No configuration needed—Inter loads automatically with weights 400, 500, and 600.

### Using Your App's Font

If your app already uses a custom font, pass it to the widget to maintain visual consistency:

```tsx
// Match your app's typography
<ChatWidget
  apiUrl="/api/chat"
  fontFamily="'Plus Jakarta Sans', sans-serif"
/>
```

**Important:** When specifying a custom font, ensure it's already loaded in your app (via Google Fonts, `@font-face`, or your framework's font loading mechanism). The widget won't load external fonts automatically when `fontFamily` is provided.

### Using System Fonts Only

To avoid loading any external fonts and use the user's system fonts:

```tsx
// Zero external font requests
<ChatWidget
  apiUrl="/api/chat"
  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
/>
```

### Font Examples

```tsx
// Google Fonts (load in your app first)
<ChatWidget fontFamily="'Nunito', sans-serif" />
<ChatWidget fontFamily="'Poppins', sans-serif" />
<ChatWidget fontFamily="'Source Sans 3', sans-serif" />

// Monospace for developer tools
<ChatWidget fontFamily="'JetBrains Mono', 'Fira Code', monospace" />

// Elegant serif
<ChatWidget fontFamily="'Merriweather', Georgia, serif" />

// Default (Inter - no prop needed)
<ChatWidget apiUrl="/api/chat" />
```

### Loading Google Fonts in Your App

If using a custom Google Font, add it to your app:

**Next.js (using `next/font`):**
```tsx
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] });

// In your layout
<ChatWidget fontFamily={nunito.style.fontFamily} />
```

**Astro (using `<link>`):**
```astro
---
// In your Layout.astro <head>
---
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600&display=swap" rel="stylesheet" />

<!-- Then in your ChatWidget config -->
<script>
  // fontFamily: "'Nunito', sans-serif"
</script>
```

**Plain HTML:**
```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600&display=swap" rel="stylesheet">
</head>
```

---

## Backend Requirements

Your API endpoint must implement the Vercel AI SDK v6 streaming protocol.

### Request Format

The widget sends POST requests with this JSON body:

```json
{
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "parts": [{ "type": "text", "text": "Hello, how are you?" }]
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "parts": [{ "type": "text", "text": "I'm doing well! How can I help?" }]
    }
  ],
  "lang": "en"
}
```

### Response Format

Return a streaming response using `toUIMessageStreamResponse()`:

```typescript
// Next.js App Router example
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages, lang } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant. Respond in ${lang === 'es' ? 'Spanish' : 'English'}.`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
```

### Example with Different Providers

```typescript
// OpenAI
import { openai } from '@ai-sdk/openai';
const model = openai('gpt-4o');

// Anthropic Claude
import { anthropic } from '@ai-sdk/anthropic';
const model = anthropic('claude-3-5-sonnet-20241022');

// Google Gemini
import { google } from '@ai-sdk/google';
const model = google('gemini-1.5-pro');

// Groq (fast inference)
import { groq } from '@ai-sdk/groq';
const model = groq('llama-3.3-70b-versatile');
```

---

## Framework Integration

### Astro (Recommended Approach)

Astro requires a special approach because it's not a React framework by default. The recommended pattern uses **script-based lazy loading** for **zero Core Web Vitals impact**.

#### Why This Approach?

| Benefit | Explanation |
|---------|-------------|
| **Zero LCP impact** | Widget loads after main content is painted |
| **Zero INP impact** | Uses `requestIdleCallback`, doesn't block main thread |
| **Zero CLS impact** | Fixed position element, no layout shift |
| **No SSR issues** | Pure Astro component, no React renderer needed at build |
| **Lazy loading** | React and widget JS only load when browser is idle |

#### Step 1: Install Dependencies

```bash
# Install the widget and peer dependencies
pnpm add @joseantonionuevo/ai-chat-widget react react-dom @ai-sdk/react ai

# Optional: For markdown rendering
pnpm add react-markdown remark-gfm
```

#### Step 2: Create the Loader Component

Create `src/components/ChatWidgetLoader.astro`:

```astro
---
/**
 * ChatWidgetLoader - Performance-optimized chat widget loader
 *
 * Loads the chat widget using requestIdleCallback for zero Core Web Vitals impact.
 */

interface Props {
  apiUrl: string;
  lang?: 'es' | 'en';
}

const { apiUrl, lang = 'en' } = Astro.props;
---

<div id="chat-widget-container" data-api-url={apiUrl} data-lang={lang}></div>

<script>
  function loadChatWidget() {
    const container = document.getElementById('chat-widget-container');
    if (!container) return;

    const apiUrl = container.dataset.apiUrl;
    const lang = container.dataset.lang as 'es' | 'en';

    // Dynamically import React and the widget only when needed
    Promise.all([
      import('react'),
      import('react-dom/client'),
      import('@joseantonionuevo/ai-chat-widget')
    ]).then(([React, ReactDOM, { ChatWidget }]) => {
      const root = ReactDOM.createRoot(container);
      root.render(
        React.createElement(ChatWidget, {
          apiUrl,
          lang,
          position: 'bottom-right'
        })
      );
    }).catch((err) => {
      console.error('[ChatWidget] Failed to load:', err);
    });
  }

  // Use requestIdleCallback for best performance, fallback to setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadChatWidget, { timeout: 3000 });
  } else {
    setTimeout(loadChatWidget, 1000);
  }
</script>
```

#### Step 3: Add to Your Layout

In your `src/layouts/Layout.astro`:

```astro
---
import ChatWidgetLoader from "../components/ChatWidgetLoader.astro";

const chatApiUrl = import.meta.env.PUBLIC_CHAT_API_URL || '/api/chat';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... your head content ... -->
  </head>
  <body>
    <slot />
    <ChatWidgetLoader apiUrl={chatApiUrl} lang="en" />
  </body>
</html>
```

#### Astro with Custom Theme

To use a custom theme (like brand colors), modify the loader:

```astro
---
interface Props {
  apiUrl: string;
  lang?: 'es' | 'en';
}

const { apiUrl, lang = 'en' } = Astro.props;
---

<div id="chat-widget-container" data-api-url={apiUrl} data-lang={lang}></div>

<script>
  function loadChatWidget() {
    const container = document.getElementById('chat-widget-container');
    if (!container) return;

    const apiUrl = container.dataset.apiUrl;
    const lang = container.dataset.lang as 'es' | 'en';

    // Custom theme matching your brand
    const customTheme = {
      primary: '#7BC7C1',           // Your brand color
      primaryHover: '#5BA8A2',
      background: '#ffffff',
      surface: '#FDF4E0',           // Cream/beige
      surfaceHover: '#FFF9F0',
      text: '#2d2d2d',
      textSecondary: '#666666',
      border: 'rgba(123, 199, 193, 0.3)',
      userBubble: '#7BC7C1',
      userBubbleText: '#ffffff',
      assistantBubble: '#FDF4E0',
      assistantBubbleText: '#2d2d2d',
      error: '#ef4444',
      errorBg: '#fef2f2',
    };

    Promise.all([
      import('react'),
      import('react-dom/client'),
      import('@joseantonionuevo/ai-chat-widget')
    ]).then(([React, ReactDOM, { ChatWidget }]) => {
      const root = ReactDOM.createRoot(container);
      root.render(
        React.createElement(ChatWidget, {
          apiUrl,
          lang,
          position: 'bottom-right',
          theme: customTheme,
          title: lang === 'es' ? 'Asistente' : 'Assistant',
          greeting: lang === 'es'
            ? '¡Hola! ¿En qué puedo ayudarte?'
            : 'Hi! How can I help you?',
        })
      );
    }).catch((err) => {
      console.error('[ChatWidget] Failed to load:', err);
    });
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadChatWidget, { timeout: 3000 });
  } else {
    setTimeout(loadChatWidget, 1000);
  }
</script>
```

#### Performance Timeline

```
Page Load:
├── HTML arrives (no widget JS blocking)
├── CSS and critical JS load
├── LCP fires (main content visible)
├── Browser becomes idle
└── Widget loads via requestIdleCallback (~1-3s after load)
    ├── React imports dynamically (~50KB)
    ├── Widget imports dynamically (~15KB)
    └── Chat button renders (user can now interact)
```

---

### Next.js (App Router)

Next.js requires a client component wrapper because the widget uses browser APIs and React hooks.

#### Why Use Dynamic Import with `ssr: false`?

1. **Avoids hydration errors**: Widget uses browser APIs (window, document)
2. **Code splitting**: Widget JS only loads on client
3. **Better performance**: Doesn't block server rendering
4. **Prevents SSR issues**: React hooks can't run on server

#### Step 1: Install Dependencies

```bash
# Install the widget and peer dependencies
pnpm add @joseantonionuevo/ai-chat-widget @ai-sdk/react ai

# Required for markdown rendering
pnpm add react-markdown remark-gfm
```

#### Step 2: Create Client Component

Create `app/components/ChatWidgetClient.tsx`:

```tsx
'use client';

/**
 * ChatWidgetClient - Client-only wrapper for the chat widget
 *
 * Uses next/dynamic with ssr: false to load the widget only on the client.
 * This avoids SSR issues with browser-only APIs used by the widget.
 */

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled - REQUIRED
const ChatWidget = dynamic(
  () => import('@joseantonionuevo/ai-chat-widget').then((mod) => mod.ChatWidget),
  {
    ssr: false,        // Critical: prevents server-side rendering
    loading: () => null, // No loading state (button appears when ready)
  }
);

interface ChatWidgetClientProps {
  apiUrl: string;
  lang?: 'en' | 'es';
}

export default function ChatWidgetClient({ apiUrl, lang = 'en' }: ChatWidgetClientProps) {
  return (
    <ChatWidget
      apiUrl={apiUrl}
      lang={lang}
      position="bottom-right"
    />
  );
}
```

#### Step 3: Add to Root Layout

In `app/layout.tsx`:

```tsx
import ChatWidgetClient from './components/ChatWidgetClient';

const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || '/api/chat';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidgetClient apiUrl={chatApiUrl} />
      </body>
    </html>
  );
}
```

#### Next.js with next-intl (i18n)

If you're using `next-intl` for internationalization:

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';

const ChatWidget = dynamic(
  () => import('@joseantonionuevo/ai-chat-widget').then((mod) => mod.ChatWidget),
  { ssr: false, loading: () => null }
);

interface ChatWidgetClientProps {
  apiUrl: string;
}

export default function ChatWidgetClient({ apiUrl }: ChatWidgetClientProps) {
  const locale = useLocale();
  const lang = locale === 'en' ? 'en' : 'es';

  return (
    <ChatWidget
      apiUrl={apiUrl}
      lang={lang}
      position="bottom-right"
    />
  );
}
```

#### Next.js: Hide Widget on Specific Routes

To hide the widget on certain pages (e.g., if you have a dedicated chat page):

```tsx
'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const ChatWidget = dynamic(
  () => import('@joseantonionuevo/ai-chat-widget').then((mod) => mod.ChatWidget),
  { ssr: false, loading: () => null }
);

interface ChatWidgetClientProps {
  apiUrl: string;
}

export default function ChatWidgetClient({ apiUrl }: ChatWidgetClientProps) {
  const pathname = usePathname();

  // Hide widget on specific routes
  const hiddenRoutes = ['/chat', '/admin', '/checkout'];
  const shouldHide = hiddenRoutes.some(route => pathname?.startsWith(route));

  if (shouldHide) {
    return null;
  }

  return (
    <ChatWidget
      apiUrl={apiUrl}
      position="bottom-right"
    />
  );
}
```

#### Next.js with Custom Theme

```tsx
'use client';

import dynamic from 'next/dynamic';

const ChatWidget = dynamic(
  () => import('@joseantonionuevo/ai-chat-widget').then((mod) => mod.ChatWidget),
  { ssr: false, loading: () => null }
);

// Define your brand theme
const brandTheme = {
  primary: '#7BC7C1',
  primaryHover: '#5BA8A2',
  background: '#ffffff',
  surface: '#FDF4E0',
  surfaceHover: '#FFF9F0',
  text: '#2d2d2d',
  textSecondary: '#666666',
  border: 'rgba(123, 199, 193, 0.3)',
  userBubble: '#7BC7C1',
  userBubbleText: '#ffffff',
  assistantBubble: '#FDF4E0',
  assistantBubbleText: '#2d2d2d',
};

interface ChatWidgetClientProps {
  apiUrl: string;
  lang?: 'en' | 'es';
}

export default function ChatWidgetClient({ apiUrl, lang = 'en' }: ChatWidgetClientProps) {
  return (
    <ChatWidget
      apiUrl={apiUrl}
      lang={lang}
      position="bottom-right"
      theme={brandTheme}
      title={lang === 'es' ? 'Asistente' : 'Assistant'}
      greeting={lang === 'es'
        ? '¡Hola! ¿En qué puedo ayudarte?'
        : 'Hi! How can I help you?'
      }
    />
  );
}
```

#### Next.js: Creating the Backend API

Create `app/api/chat/route.ts`:

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge'; // Optional: Use edge runtime for faster responses

export async function POST(req: Request) {
  const { messages, lang } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant. Respond in ${lang === 'es' ? 'Spanish' : 'English'}.`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
```

---

### Vite / Create React App

For standard React apps:

```tsx
// App.tsx
import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';

function App() {
  return (
    <>
      <YourAppContent />
      <ChatWidget
        apiUrl={import.meta.env.VITE_CHAT_API_URL || '/api/chat'}
        theme="midnight"
      />
    </>
  );
}

export default App;
```

---

### Remix

```tsx
// app/root.tsx
import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ChatWidget apiUrl="/api/chat" />
        <Scripts />
      </body>
    </html>
  );
}
```

---

## Advanced Usage

### Accessing Theme Presets Programmatically

```tsx
import { presets, resolveTheme } from '@joseantonionuevo/ai-chat-widget';

// Get a preset directly
console.log(presets.midnight);
// { name: 'midnight', primary: '#6366f1', ... }

// Resolve any theme (preset name or custom config)
const resolved = resolveTheme('ocean');
const custom = resolveTheme({ primary: '#ff0000', background: '#000', surface: '#111', text: '#fff' });
```

### Using Individual Components

For complete customization, import individual components:

```tsx
import {
  ChatButton,
  ChatWindow,
  MessageBubble,
  MessageInput,
  LoadingIndicator,
  resolveTheme,
  getLabels,
} from '@joseantonionuevo/ai-chat-widget';

// Build your own chat interface
function CustomChat() {
  const theme = resolveTheme('ocean');
  const labels = getLabels('en');

  // Your custom implementation...
}
```

### Using the Rate Limit Hook

For custom error handling, use the `useRateLimitRetry` hook:

```tsx
import { useRateLimitRetry, classifyError } from '@joseantonionuevo/ai-chat-widget';

function CustomErrorHandler({ error, onRetry }) {
  const errorInfo = classifyError(error);

  const {
    countdown,
    isAutoRetrying,
    cancelAutoRetry,
    manualRetry,
  } = useRateLimitRetry({
    errorInfo,
    onRetry,
    autoRetry: true,
    maxRetries: 3,
  });

  if (errorInfo?.type === 'rate_limit') {
    return (
      <div>
        <p>Rate limited! {countdown > 0 && `Retry in ${countdown}s`}</p>
        {isAutoRetrying ? (
          <button onClick={cancelAutoRetry}>Cancel</button>
        ) : (
          <button onClick={manualRetry}>Retry Now</button>
        )}
      </div>
    );
  }

  return <p>Error: {error.message}</p>;
}
```

### Conditional Rendering

```tsx
import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';
import { usePathname } from 'next/navigation';

function ConditionalChat() {
  const pathname = usePathname();

  // Hide on certain pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  return <ChatWidget apiUrl="/api/chat" />;
}
```

---

## TypeScript

Full TypeScript support is included. Import types as needed:

```tsx
import type {
  // Main props
  ChatWidgetProps,

  // Theme types
  ThemeConfig,
  ThemeProp,
  PresetThemeName,
  ResolvedTheme,

  // i18n types
  Lang,
  Labels,

  // Error handling types
  RateLimitOptions,
  ErrorInfo,
  ErrorType,

  // Misc
  Position,
} from '@joseantonionuevo/ai-chat-widget';

// Example: Type-safe custom theme
const myTheme: ThemeConfig = {
  primary: '#ff6b6b',
  background: '#1a1a2e',
  surface: '#16213e',
  text: '#eaeaea',
};

// Example: Type-safe props
const widgetProps: ChatWidgetProps = {
  apiUrl: '/api/chat',
  theme: myTheme,
  lang: 'en',
  position: 'bottom-right',
};
```

---

## Dependencies

This package is built with:

| Dependency | Version | Purpose |
|------------|---------|---------|
| [Vercel AI SDK](https://ai-sdk.dev/) | v6.0.62 | Streaming chat, LLM integrations |
| [React](https://react.dev/) | v19 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | v5.9 | Type safety |

Optional dependencies for enhanced features:

| Dependency | Purpose |
|------------|---------|
| [react-markdown](https://github.com/remarkjs/react-markdown) | Markdown rendering |
| [remark-gfm](https://github.com/remarkjs/remark-gfm) | GitHub Flavored Markdown |

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines
- How to add new themes
- How to add new languages
- Pull request process

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/JoseAntonioNuevo/ai-chat-widget/issues)
- **Discussions**: [GitHub Discussions](https://github.com/JoseAntonioNuevo/ai-chat-widget/discussions)

---

Made with love by [Jose Antonio Nuevo](https://github.com/JoseAntonioNuevo)
