'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';

// ✅ Disable SSR for CKEditor
const CKEditorWrapper = dynamic(() => import('../../../components/CKClear'), {
  ssr: false,
});

export default function HomePage() {
  const [content, setContent] = useState('<p>Hello CKEditor!</p>');

  return (
    <div>
      <h1>CKEditor with Next.js</h1>
      <CKEditorWrapper value={content} onChange={setContent} />
    </div>
  );
}
