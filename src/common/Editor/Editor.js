// import React, { useEffect, useRef } from "react";

// function Editor({ onChange, editorLoaded, name, value }) {
//   const editorRef = useRef();
//   const { CKEditor, ClassicEditor } = editorRef.current || {};

//   useEffect(() => {
//     editorRef.current = {
//       CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
//       ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
//     };
//   }, []);

//   return (
//     <div>
//       {editorLoaded ? (
//         <CKEditor
//           type=""
//           name={name}
//           editor={ClassicEditor}
//           config={{
//             ckfinder: {
//               // Upload the images to the server using the CKFinder QuickUpload command
//               // You have to change this address to your server that has the ckfinder php connector
//               uploadUrl: "", //Enter your upload url
//             },
//           }}
//           data={value}
//           onChange={(event, editor) => {
//             const data = editor.getData();
//             // console.log({ event, editor, data })
//             onChange(data);
//           }}
//         />
//       ) : (
//         <div>Editor loading</div>
//       )}
//     </div>
//   );
// }

// export default Editor;

// Editor.js

// import React, { useEffect, useRef } from "react";

// function Editor({ onChange, editorLoaded, name, value }) {
//   const editorRef = useRef();
//   const { CKEditor, ClassicEditor } = editorRef.current || {};

//   useEffect(() => {
//     editorRef.current = {
//       CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
//       ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
//     };
//   }, []);

//   return (
//     <div>
//       {editorLoaded && CKEditor ? ( // Check if CKEditor is loaded before rendering
//         <CKEditor
//           type=""
//           name={name}
//           editor={ClassicEditor}
//           config={{
//             ckfinder: {
//               uploadUrl: "", //Enter your upload url
//             },
//           }}
//           data={value}
//           onChange={(event, editor) => {
//             const data = editor.getData();
//             onChange(data); // Call the parent's onChange function
//           }}
//         />
//       ) : (
//         <div>Editor loading</div>
//       )}
//     </div>
//     // <div>jjjjjjjjjjj</div>
//   );
// }

// export default Editor; // Ensure the component is correctly exported

import React, { useEffect, useRef } from "react";

function Editor({ onChange, editorLoaded, name, value }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
  }, []);

  return (
    <div>
      {editorLoaded && CKEditor ? (
        <CKEditor
          name={name}
          editor={ClassicEditor}
          config={{
            ckfinder: {
              uploadUrl: "", //Enter your upload url
            },
          }}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  );
}

export default Editor;
