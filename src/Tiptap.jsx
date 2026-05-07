import { useEditor, EditorContent } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { Node, mergeAttributes } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Placeholder } from '@tiptap/extensions'


const Tiptap = () => {

  const Title = Node.create({
    name: 'title',
    group: 'block',
    content: 'inline*', // Faqat matn qabul qiladi
    defining: true, // Enter bosganda yangi paragrafga o'tishiga yordam beradi

    parseHTML() {
      return [{ tag: 'h2' }]
    },

    renderHTML({ HTMLAttributes }) {
      return ['h2', mergeAttributes(HTMLAttributes), 0]
    },

    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          const { state } = editor
          const { $from } = state.selection

          if ($from.parent.type.name !== 'title') {
            return false
          }

          return editor
            .chain()
            .focus()
            .insertContentAt($from.after(), {
              type: 'customParagraph',
            })
            .setTextSelection($from.after() + 1)
            .run()
        },
      }
    }
  })

  const CustomParagraph = Node.create({
    name: 'customParagraph',
    group: 'block',
    content: 'inline*',
    defining: true,

    parseHTML() {
      return [{ tag: 'p.custom-p' }]
    },
    renderHTML({ HTMLAttributes }) {
      return ['p', mergeAttributes(HTMLAttributes, { class: 'custom-p' }), 0]
    },

    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          const { state } = editor
          const { $from } = state.selection

          if ($from.parent.type.name !== 'customParagraph') {
            return false
          }

          return editor
            .chain()
            .focus()
            .setTextSelection($from.after() + 2)
            .run()
        },
      }
    }
  })

  const CustomBody = Node.create({
    name: 'customBody',
    group: 'block',
    content: 'block*',
    defining: true,

    parseHTML() {
      return [{ tag: 'div.custom-div' }]
    },

    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(HTMLAttributes, { class: 'custom-div' }), 0]
    },
  })

  const CustomDocument = Document.extend({
    content: 'title customParagraph customBody',
  })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        paragraph: false,
      }),
      Placeholder.configure({
        showOnlyCurrent: false,
        placeholder: ({ node }) => {
          if (node.type.name === 'title') return 'Title'
          if (node.type.name === 'customParagraph') return 'Your name'
          if (node.type.name === 'paragraph') return 'hi'
          return ''
        },
      }),
      CustomDocument,
      Title,
      CustomParagraph,
      CustomBody,
      Paragraph,
      Text
    ],

    content: {
      type: 'doc',
      content: [
        {
          type: 'title',
        },
        {
          type: 'customParagraph',
        },
        {
          type: 'customBody',
          content: [
            {
              type: 'paragraph',
            },
          ],
        },
      ],
    },


    autofocus: 'start',

    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },

  })

  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>
        <div className="bubble-menu">
          <button
            onClick={() => {
              editor.chain().focus().toggleBold().run()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M178.48,115.7A44,44,0,0,0,148,40H80a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM88,56h60a28,28,0,0,1,0,56H88Zm72,136H88V128h72a32,32,0,0,1,0,64Z"></path></svg>
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleItalic().run()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M200,56a8,8,0,0,1-8,8H157.77L115.1,192H144a8,8,0,0,1,0,16H64a8,8,0,0,1,0-16H98.23L140.9,64H112a8,8,0,0,1,0-16h80A8,8,0,0,1,200,56Z"></path></svg>
          </button>
          <button
            onClick={() => {
              const url = window.prompt('URL manzilini kiriting')
              if (url) {
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path></svg>
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }}
            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}

          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path></svg>
          </button>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path></svg>
          </button>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M100,56H40A16,16,0,0,0,24,72v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,100,56Zm0,80H40V72h60ZM216,56H156a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,216,56Zm0,80H156V72h60Z"></path></svg>
          </button>
        </div>
      </BubbleMenu>
    </>
  )
}

export default Tiptap 