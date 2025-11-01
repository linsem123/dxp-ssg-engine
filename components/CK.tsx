
"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default function CKEditorWrapper({ value, onChange }: any) {
  const editorConfig = {
    toolbar: [
      "heading",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "insertCustomImage", // our custom button
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
    ],
    extraPlugins: [CustomImageButtonPlugin],
    licenseKey: "", // ← Add your key here

  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={editorConfig}
      onChange={(_, editor) => onChange(editor.getData())}
    />
  );
}

// Custom plugin to add a button that triggers JS logic
function CustomImageButtonPlugin(editor: any) {
  // Define a custom command
  editor.commands.add("insertCustomImage", {
    execute: async () => {
      const imageUrl = await customImageHandler();

      editor.model.change((writer: any) => {
        const imageElement = writer.createElement("image", { src: imageUrl });
        editor.model.insertContent(
          imageElement,
          editor.model.document.selection
        );
      });
    },
  });

  // Add a button to the toolbar that executes the command
  editor.ui.componentFactory.add("insertCustomImage", (locale: any) => {
    const button = new editor.ui.button.ButtonView(locale);
    button.label = "Insert Image";
    button.tooltip = true;

    // Link button to the command
    button.bind("isEnabled").to(editor.commands.get("insertCustomImage"), "isEnabled");
    button.on("execute", () => editor.execute("insertCustomImage"));

    return button;
  });
}

// Example JS function to get image URL
async function customImageHandler() {
  // Replace this with your modal, server call, or generated image
  return "https://via.placeholder.com/300x150.png?text=Custom+Image";
}
