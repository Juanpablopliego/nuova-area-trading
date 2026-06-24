'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { setAtPath } from '@/lib/objectPath';

const ContentContext = createContext(null);

function getAtPath(obj, path) {
  return path.reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const timers = useRef({});

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then(setContent);
  }, []);

  const save = useCallback((path, value) => {
    fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, value }),
    });
  }, []);

  const update = useCallback(
    (path, value) => {
      setContent((prev) => setAtPath(prev, path, value));
      const key = path.join('.');
      clearTimeout(timers.current[key]);
      timers.current[key] = setTimeout(() => save(path, value), 600);
    },
    [save]
  );

  const flush = useCallback(
    (path, value) => {
      const key = path.join('.');
      clearTimeout(timers.current[key]);
      save(path, value);
    },
    [save]
  );

  if (!content) return null;

  return (
    <ContentContext.Provider value={{ content, update, flush, getAtPath }}>{children}</ContentContext.Provider>
  );
}

export function useContent(path) {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  const value = getAtPath(ctx.content, path);
  const setValue = (next) => ctx.update(path, next);
  const flushValue = (next) => ctx.flush(path, next);
  return [value, setValue, flushValue];
}

export function useContentRoot() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContentRoot must be used within ContentProvider');
  return ctx.content;
}
