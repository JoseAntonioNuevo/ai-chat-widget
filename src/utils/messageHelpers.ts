import type { UIMessage } from 'ai';

/**
 * Text part from UIMessage
 */
interface TextPart {
  type: 'text';
  text: string;
}

/**
 * Type guard for text parts
 */
function isTextPart(part: unknown): part is TextPart {
  return (
    typeof part === 'object' &&
    part !== null &&
    'type' in part &&
    (part as TextPart).type === 'text' &&
    'text' in part &&
    typeof (part as TextPart).text === 'string'
  );
}

/**
 * Extract text content from a UIMessage's parts array
 *
 * @param message - UIMessage from Vercel AI SDK v6
 * @returns Combined text content from all text parts
 */
export function getMessageText(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) {
    return '';
  }

  return message.parts.filter(isTextPart).map((part) => part.text).join('');
}
