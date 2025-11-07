'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import { useEffect, useRef, useState } from 'react';

class InsertDatePlugin {
  private editor: any;

  constructor(editor: any) {
    this.editor = editor;
  }

  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertDate', (locale: any) => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert Date',
        withText: true,
        tooltip: true
      });

      view.on('execute', () => {
        const date = new Date().toLocaleDateString();
        editor.model.change((writer: any) => {
          const insertPosition = editor.model.document.selection.getFirstPosition();
          writer.insertText(date, insertPosition);
        });
      });

      return view;
    });
  }
}

export default function CKEditorWrapper({ value, onChange }: any) {
  const editorRef = useRef<any>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  const editorConfig = {
    toolbar: [
      'insertDate',
      'heading',
      'bold',
      'link',
      'bulletedList',
      'numberedList',
      'imageUpload', // will replace
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo'
    ],
    extraPlugins: [InsertDatePlugin],
    licenseKey: '' // ← Add your key here
  };

  useEffect(() => {
    if (!editorLoaded || !editorRef.current) return;

    // Wait for DOM to render toolbar
    const interval = setInterval(() => {
      const fileButton = document.querySelector<HTMLElement>('.ck-file-dialog-button');

      if (fileButton) {
        // Replace old node to remove default click listeners
        const newButton = fileButton.cloneNode(true) as HTMLElement;
        fileButton.parentNode?.replaceChild(newButton, fileButton);

        newButton.addEventListener('click', async e => {
          e.preventDefault();
          e.stopPropagation();

          const editor = editorRef.current.editor;
          const imageUrl = await customImageHandler();

          // ✅ Correct image insert
          editor.model.change((writer: any) => {
            const imageElement = writer.createElement('imageBlock', {
              src: imageUrl
            });

            editor.model.insertContent(imageElement, editor.model.document.selection);
          });
        });

        clearInterval(interval);
      }
    }, 100);
  }, [editorLoaded]);

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={editorConfig}
      onReady={editor => {
        editorRef.current = { editor };
        setEditorLoaded(true);
      }}
      onChange={(_, editor) => onChange(editor.getData())}
      onReady={editor => {
        editorRef.current = { editor };
        setEditorLoaded(true);

        // 🚫 Block pasted images
        editor.editing.view.document.on('paste', (evt, data) => {
          const dataTransfer = data.dataTransfer;

          if (dataTransfer && dataTransfer.getFiles().length > 0) {
            evt.stop(); // Stop CKEditor clipboard pipeline
            evt.preventDefault(); // Prevent image insertion

            // Optional: your custom handler (e.g. upload -> insert)
            // const file = dataTransfer.getFiles()[0];
            // yourCustomImageUpload(file);

            console.log('Pasted image blocked!');
          }
        });
      }}
    />
  );
}

// Example custom JS image handler
async function customImageHandler() {
  // Could open a modal, fetch from server, generate image, etc.
  return 'https://developer.mozilla.org/shared-assets/images/examples/favicon144.png';
}
