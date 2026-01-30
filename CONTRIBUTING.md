# Contributing to AI Chat Widget

Thank you for your interest in contributing to AI Chat Widget! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoseAntonioNuevo/ai-chat-widget.git
   cd ai-chat-widget
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development mode**
   ```bash
   pnpm dev
   ```

## Project Structure

```
src/
├── ChatWidget.tsx      # Main component
├── index.ts            # Package exports
├── types.ts            # Public TypeScript types
├── components/         # UI components
│   ├── ChatButton.tsx
│   ├── ChatWindow.tsx
│   ├── MessageBubble.tsx
│   └── ...
├── themes/             # Theme system
│   ├── presets.ts      # 5 color presets
│   ├── resolve.ts      # Theme resolution logic
│   └── types.ts
├── i18n/               # Internationalization
│   ├── en.ts
│   └── es.ts
├── hooks/              # React hooks
└── utils/              # Utility functions
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style (ESLint will help)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Running Linters

```bash
pnpm lint       # Run ESLint
pnpm typecheck  # Run TypeScript type checking
```

## Making Changes

### Adding a New Theme Preset

1. Add your theme to `src/themes/presets.ts`:
   ```typescript
   export const myTheme: ThemePreset = {
     name: 'my-theme',
     primary: '#...',
     // ... other colors
   };
   ```

2. Add it to the `presets` object at the bottom of the file

3. Update `PresetThemeName` type in `src/themes/types.ts`

### Adding a New Language

1. Create a new file in `src/i18n/` (e.g., `fr.ts`)

2. Export your translations following the `Labels` interface

3. Add the language to `src/i18n/index.ts`

4. Update the `Lang` type in `src/i18n/types.ts`

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linters
5. Commit your changes with a descriptive message
6. Push to your fork
7. Open a Pull Request

### PR Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Add tests for new functionality
- Ensure all checks pass

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment information
- Relevant code snippets or screenshots

## Questions?

Feel free to open an issue for questions or discussions!
