"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Custom plugin to override imageUpload
function CustomImageUploadPlugin(editor: any) {
  editor.ui.componentFactory.add("imageUpload", (locale: any) => {
    const button = editor.ui.componentFactory.create("button", { label: "Insert Image" });

    // Override click behavior
    button.on("execute", async () => {
      // --- YOUR CUSTOM IMAGE HANDLER ---
      // e.g., generate an image, fetch from server, open modal, etc.
      const imageUrl = await customImageHandler();

      // Insert the image into the editor
      editor.model.change((writer: any) => {
        const imageElement = writer.createElement("image", {
          src: imageUrl,
        });
        editor.model.insertContent(
          imageElement,
          editor.model.document.selection
        );
      });
    });

    return button;
  });
}

// Example of your JS handler
async function customImageHandler() {
  // You can generate a URL, open modal, fetch image, or anything
  // Example: insert a placeholder image
  return "https://via.placeholder.com/300x150.png?text=Custom+Image";
}


export default function CKEditorWrapper({ value, onChange }: any) {

  const customConfig = {
    toolbar: [
      "heading",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "imageUpload",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
    ],
    extraPlugins: [CustomImageUploadPlugin],
    licenseKey: "", // ← Add your key here

  };

  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={value}
      config={customConfig}
      onChange={(_, editor) => onChange(editor.getData())}
    />
  );
}