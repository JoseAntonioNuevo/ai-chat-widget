# CLAUDE.md

## CRITICAL RULES

**NEVER commit or push anything. NEVER. The user will handle all git operations themselves.**

- Do NOT run `git commit`
- Do NOT run `git push`
- Do NOT run `git add . && git commit`
- Do NOT create commits for any reason
- If you make changes, just make the changes - the user will commit when ready

---

## Project Overview

**Package Name:** `@joseantonionuevo/ai-chat-widget`

**What is this?**
A public, open-source npm package that provides a ready-to-use, customizable floating chat widget for AI-powered applications. It's built with React and integrates with Vercel AI SDK v6 for real-time streaming chat.

**Target Users:**
- Developers who want to add AI chat to their apps without building UI from scratch
- SaaS products needing customer support chatbots
- Documentation sites with Q&A bots
- Any React application that needs conversational AI

**Registry:** npm public registry (NOT GitHub Packages)

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.9.x | Type safety |
| Vercel AI SDK | 6.x | Chat streaming, LLM integration |
| @ai-sdk/react | 3.x | React hooks (useChat) |
| tsup | 8.x | Build/bundling |
| ESLint | 9.x | Linting (flat config) |
| pnpm | 9.x | Package manager |

**Optional peer dependencies:**
- `react-markdown` - For rendering markdown in assistant messages
- `remark-gfm` - For GitHub Flavored Markdown support

---

## Directory Structure

```
/Users/jose/Documents/ai-chat-widget/
├── src/
│   ├── index.ts                 # Main package exports
│   ├── ChatWidget.tsx           # Main component (orchestrates everything)
│   ├── types.ts                 # Public TypeScript types (ChatWidgetProps)
│   │
│   ├── components/              # UI Components
│   │   ├── index.ts             # Component exports
│   │   ├── ChatButton.tsx       # Floating toggle button (bottom corner)
│   │   ├── ChatWindow.tsx       # Main chat window container
│   │   ├── MessageBubble.tsx    # Individual message (user/assistant)
│   │   ├── MessageInput.tsx     # Text input + send button
│   │   ├── LoadingIndicator.tsx # "Thinking..." animation
│   │   ├── ErrorMessage.tsx     # Error display with retry
│   │   └── Icons.tsx            # SVG icons (Chat, Close, Send)
│   │
│   ├── themes/                  # Theme System
│   │   ├── index.ts             # Theme exports
│   │   ├── types.ts             # ThemeConfig, PresetThemeName, etc.
│   │   ├── presets.ts           # 5 predefined themes
│   │   └── resolve.ts           # Theme resolution logic
│   │
│   ├── i18n/                    # Internationalization
│   │   ├── index.ts             # i18n exports
│   │   ├── types.ts             # Lang, Labels types
│   │   ├── en.ts                # English translations
│   │   └── es.ts                # Spanish translations
│   │
│   ├── hooks/                   # React Hooks
│   │   └── useScrollToBottom.ts # Auto-scroll on new messages
│   │
│   └── utils/                   # Utilities
│       └── messageHelpers.ts    # Extract text from UIMessage
│
├── dist/                        # Build output (generated)
│   ├── index.js                 # ESM bundle
│   ├── index.cjs                # CommonJS bundle
│   ├── index.d.ts               # TypeScript declarations
│   └── themes/                  # Theme subpath export
│
├── .github/
│   └── workflows/
│       └── publish.yml          # GitHub Actions for npm publish
│
├── package.json                 # Package config
├── tsconfig.json                # TypeScript config
├── tsup.config.ts               # Build config
├── eslint.config.mjs            # ESLint flat config
├── README.md                    # User documentation
├── CONTRIBUTING.md              # Contribution guide
├── LICENSE                      # MIT License
└── CLAUDE.md                    # This file
```

---

## How Components Work Together

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ChatWidget.tsx                          │
│  (Main orchestrator - manages state, theme, labels)             │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │ resolveTheme│    │ mergeLabels  │    │ useChat (AI SDK)│    │
│  │ (themes/)   │    │ (i18n/)      │    │                 │    │
│  └──────┬──────┘    └──────┬───────┘    └────────┬────────┘    │
│         │                  │                     │              │
│         └──────────────────┼─────────────────────┘              │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Internal State                        │   │
│  │  - isOpen (boolean)                                      │   │
│  │  - input (string)                                        │   │
│  │  - messages (UIMessage[]) - from useChat                 │   │
│  │  - status ('ready'|'streaming'|'submitted'|'error')      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         ▼                  ▼                  ▼                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │ ChatButton  │    │ ChatWindow  │    │   <style>   │        │
│  │             │    │             │    │ (animations)│        │
│  └─────────────┘    └──────┬──────┘    └─────────────┘        │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌───────────┐  ┌───────────┐  ┌───────────┐
       │MessageBubble│  │MessageInput│  │LoadingIndicator│
       │           │  │           │  │ErrorMessage│
       └───────────┘  └───────────┘  └───────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `ChatWidget.tsx` | Main entry point. Resolves theme, merges labels, manages open/close state, handles useChat hook, renders ChatButton + ChatWindow |
| `ChatButton.tsx` | Floating circular button. Shows chat icon when closed, X icon when open. Handles hover effects. |
| `ChatWindow.tsx` | Main chat container. Header with title + close button, message list, input area. |
| `MessageBubble.tsx` | Single message. User messages = plain text, Assistant messages = Markdown (lazy loaded). |
| `MessageInput.tsx` | Text input field + send button. Handles form submission, disabled states. |
| `LoadingIndicator.tsx` | Bouncing dots + "Thinking..." text. Shown when `status === 'streaming' \|\| 'submitted'`. |
| `ErrorMessage.tsx` | Error text + Retry button. Shown when `error` is truthy. |
| `Icons.tsx` | SVG components: ChatIcon, CloseIcon, SendIcon (default icons, can be overridden) |

---

## Custom Icons

The floating button icon is fully customizable. Users can pass any React node as the icon.

### CustomIcons Interface

```typescript
interface CustomIcons {
  open?: ReactNode;   // Icon when chat is closed (click to open)
  close?: ReactNode;  // Icon when chat is open (click to close)
}
```

### Usage Examples

```tsx
// Using Lucide React
import { MessageCircle, X } from 'lucide-react';

<ChatWidget
  apiUrl="/api/chat"
  icon={{
    open: <MessageCircle size={24} />,
    close: <X size={24} />,
  }}
/>

// Using Heroicons
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';

<ChatWidget
  apiUrl="/api/chat"
  icon={{
    open: <ChatBubbleLeftIcon className="w-6 h-6" />,
    close: <XMarkIcon className="w-6 h-6" />,
  }}
/>

// Using emoji
<ChatWidget
  apiUrl="/api/chat"
  icon={{ open: '🤖', close: '✕' }}
/>

// Using custom SVG
<ChatWidget
  apiUrl="/api/chat"
  icon={{
    open: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="..." />
      </svg>
    ),
  }}
/>
```

### Default Icons

If no custom icon is provided, the widget uses built-in SVG icons:
- **Open state**: Chat bubble icon (`ChatIcon`)
- **Close state**: X icon (`CloseIcon`)

These default icons are also exported for reuse:
```typescript
import { ChatIcon, CloseIcon, SendIcon } from '@joseantonionuevo/ai-chat-widget';
```

---

## Theme System

### How Themes Work

1. **User passes theme prop** - Either a preset name (`'midnight'`) or custom config object
2. **resolveTheme()** converts to full theme:
   - If preset name → returns that preset
   - If custom config → merges with defaults, auto-generates optional colors
3. **Theme is passed to all components** as `ResolvedTheme` (all properties required)

### Theme Properties

| Property | Required | Default Fallback | Used For |
|----------|----------|------------------|----------|
| `primary` | Yes | - | Buttons, user bubbles, accents |
| `background` | Yes | - | Chat window background |
| `surface` | Yes | - | Input area, assistant bubbles |
| `text` | Yes | - | Primary text color |
| `primaryHover` | No | Darker primary | Hover states |
| `surfaceHover` | No | Lighter surface | Hover states |
| `textSecondary` | No | Lighter text | Muted text, "Thinking..." |
| `border` | No | Same as surface | Borders, dividers |
| `userBubble` | No | Same as primary | User message background |
| `userBubbleText` | No | White (#ffffff) | User message text |
| `assistantBubble` | No | Same as surface | Assistant message background |
| `assistantBubbleText` | No | Same as text | Assistant message text |
| `error` | No | Red (#ef4444) | Error text |
| `errorBg` | No | Dark red (#450a0a) | Error background |

### 5 Preset Themes

| Preset | Primary Color | Style |
|--------|---------------|-------|
| `midnight` (default) | `#6366f1` Indigo | Dark slate background |
| `ocean` | `#0ea5e9` Sky blue | Dark blue background |
| `forest` | `#22c55e` Green | Dark green background |
| `sunset` | `#f97316` Orange | Dark stone background |
| `lavender` | `#a855f7` Purple | Dark purple background |

---

## i18n System

### How It Works

1. **User passes lang prop** - Any string (e.g., `'en'`, `'es'`, `'fr'`, `'de'`, `'pt-BR'`)
2. **Built-in translations** - Only `'en'` and `'es'` have defaults
3. **User can pass labels prop** - Partial or full override of any label
4. **mergeLabels()** combines base language labels with custom overrides
5. **Lang is sent to backend** - The `lang` value is included in API requests

### Built-in Labels (English/Spanish)

| Key | English | Spanish | Used In |
|-----|---------|---------|---------|
| `title` | Chat Assistant | Asistente de Chat | Window header |
| `placeholder` | Type your message... | Escribe tu mensaje... | Input field |
| `send` | Send message | Enviar mensaje | Send button (aria-label) |
| `close` | Close chat | Cerrar chat | Close button (aria-label) |
| `open` | Open chat | Abrir chat | Open button (aria-label) |
| `thinking` | Thinking | Pensando | Loading indicator |
| `error` | Something went wrong... | Algo salió mal... | Error message |
| `retry` | Retry | Reintentar | Retry button |

### Using Other Languages

For languages without built-in translations, provide all labels:

```tsx
// French example
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
  }}
/>
```

### Types

```typescript
type Lang = string;                    // Any language code
type BuiltInLang = 'en' | 'es';        // Languages with defaults
```

---

## AI SDK Integration

### How Chat Works

1. **DefaultChatTransport** is created with:
   - `api`: The user's API endpoint URL
   - `body`: Additional data sent with each request (`{ lang }`)

2. **useChat hook** manages:
   - `messages`: Array of UIMessage objects
   - `sendMessage()`: Sends a new message
   - `regenerate()`: Retries the last assistant message
   - `status`: Current state ('ready', 'streaming', 'submitted', 'error')
   - `error`: Error object if something went wrong

3. **Message Format** (UIMessage from AI SDK v6):
   ```typescript
   {
     id: string;
     role: 'user' | 'assistant' | 'system';
     parts: Array<{ type: 'text'; text: string } | ...>;
   }
   ```

4. **Backend must return** streaming response using `toUIMessageStreamResponse()`

---

## Build System

### tsup Configuration

```typescript
// tsup.config.ts
{
  entry: {
    index: 'src/index.ts',           // Main entry
    'themes/index': 'src/themes/index.ts',  // Subpath export
  },
  format: ['cjs', 'esm'],  // Both CommonJS and ES Modules
  dts: true,               // Generate .d.ts files
  external: ['react', 'react-dom', '@ai-sdk/react', 'ai', 'react-markdown', 'remark-gfm'],
  minify: true,
  sourcemap: true,
}
```

### Package Exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./themes": {
      "types": "./dist/themes/index.d.ts",
      "import": "./dist/themes/index.js",
      "require": "./dist/themes/index.cjs"
    }
  }
}
```

### Commands

| Command | What it does |
|---------|-------------|
| `pnpm build` | Build the package (runs tsup) |
| `pnpm dev` | Watch mode for development |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |

---

## Relationship to megrowth-chat

This package was **extracted from** the `megrowth-chat` project:

| Project | Location | Purpose |
|---------|----------|---------|
| **ai-chat-widget** | `/Users/jose/Documents/ai-chat-widget` | Public npm package (generic, no branding) |
| **megrowth-chat** | `/Users/jose/Documents/growth/megrowth-chat` | Private Me Growth chat service + original widget |

### Key Differences

| Aspect | ai-chat-widget (this) | megrowth-chat (original) |
|--------|----------------------|--------------------------|
| Registry | npm public | GitHub Packages (private) |
| Default theme | Dark (midnight) | Light (teal/cream Me Growth branding) |
| Branding | Generic "Chat Assistant" | "Me Growth Assistant" |
| Greeting | Optional, user-provided | Hardcoded Me Growth greeting |
| Colors | 5 dark presets | Teal/cream hardcoded |

### Future Plan

After this package is published to npm, `megrowth-chat` will:
1. Install `@joseantonionuevo/ai-chat-widget` from npm
2. Use it with a custom Me Growth theme (teal/cream)
3. Remove the old widget code from the private repo

---

## Publishing (for reference - user handles this)

The package is configured to publish to **npm public registry** (not GitHub Packages).

GitHub Actions workflow (`.github/workflows/publish.yml`) will:
1. Run on release creation or manual trigger
2. Build the package
3. Publish to npm using `NPM_TOKEN` secret

The user needs to:
1. Create the GitHub repo
2. Add `NPM_TOKEN` secret (from npmjs.com)
3. Create a release to trigger publish

---

## Common Tasks

### Add a New Theme Preset

1. Edit `src/themes/presets.ts`
2. Add new theme object following `ThemePreset` interface
3. Add to `presets` object
4. Add name to `PresetThemeName` type in `src/themes/types.ts`
5. Rebuild: `pnpm build`

### Add a New Language

1. Create `src/i18n/{lang}.ts` (copy from `en.ts`)
2. Translate all strings
3. Add to `translations` object in `src/i18n/index.ts`
4. Add to `Lang` type in `src/i18n/types.ts`
5. Rebuild: `pnpm build`

### Add a New Prop

1. Add to `ChatWidgetProps` interface in `src/types.ts`
2. Handle in `ChatWidget.tsx`
3. Pass to relevant child components
4. Update README documentation
5. Rebuild: `pnpm build`

### Test Locally

```bash
# In ai-chat-widget directory
pnpm build

# In a test project
pnpm add /Users/jose/Documents/ai-chat-widget
```

---

## Files Reference

### Core Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Main exports - everything users can import |
| `src/ChatWidget.tsx` | Main component with all logic |
| `src/types.ts` | Public TypeScript types |

### Theme Files

| File | Purpose |
|------|---------|
| `src/themes/index.ts` | Theme exports |
| `src/themes/types.ts` | Theme TypeScript types |
| `src/themes/presets.ts` | 5 preset theme definitions |
| `src/themes/resolve.ts` | `resolveTheme()` function |

### i18n Files

| File | Purpose |
|------|---------|
| `src/i18n/index.ts` | i18n exports, `getLabels()`, `mergeLabels()` |
| `src/i18n/types.ts` | `Lang`, `Labels` types |
| `src/i18n/en.ts` | English translations |
| `src/i18n/es.ts` | Spanish translations |

### Component Files

| File | Purpose |
|------|---------|
| `src/components/ChatButton.tsx` | Floating toggle button |
| `src/components/ChatWindow.tsx` | Chat window container |
| `src/components/MessageBubble.tsx` | Message display |
| `src/components/MessageInput.tsx` | Input form |
| `src/components/LoadingIndicator.tsx` | Loading state |
| `src/components/ErrorMessage.tsx` | Error state |
| `src/components/Icons.tsx` | SVG icons |

### Config Files

| File | Purpose |
|------|---------|
| `package.json` | Package metadata, dependencies, scripts |
| `tsconfig.json` | TypeScript configuration |
| `tsup.config.ts` | Build configuration |
| `eslint.config.mjs` | ESLint configuration |

---

## Remember

1. **NEVER commit or push** - User handles all git operations
2. **Always rebuild after changes** - `pnpm build`
3. **This is a PUBLIC package** - No Me Growth branding or secrets
4. **Peer dependencies are external** - Not bundled, user must install
5. **Dark mode by default** - Midnight theme is the default
