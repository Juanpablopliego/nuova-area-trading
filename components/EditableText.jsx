'use client';
import { useState } from 'react';
import { useContent } from './ContentProvider';

// Inline-editable text bound to a path in the shared content document.
// Renders as `as` (span/h3/p/strong/...) with contentEditable; saves on blur,
// and after a debounce while typing (see ContentProvider.update).
//
// The DOM text is intentionally uncontrolled after mount: React re-rendering
// this node's children on every keystroke (driven by our own update() call)
// resets the contentEditable caret to the start, scrambling the typed text.
// `initial` captures the value once; subsequent edits flow one-way into the
// shared content state for autosave, without feeding back into this render.
export function EditableText({ path, as = 'span', className }) {
  const [value, update, flush] = useContent(path);
  const [initial] = useState(value);

  return (
    <Tag
      as={as}
      className={['editable', className].filter(Boolean).join(' ')}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => update(e.currentTarget.textContent)}
      onBlur={(e) => flush(e.currentTarget.textContent)}
    >
      {initial}
    </Tag>
  );
}

function Tag({ as: As, children, ...props }) {
  return <As {...props}>{children}</As>;
}
