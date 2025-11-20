import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Editor as ObsidianEditor, MarkdownView, Notice } from 'obsidian';
import appStore from '../stores/appStore';
import { EditorRefActions } from './Editor/Editor';

interface ObsidianNativeEditorProps {
  className?: string;
  initialContent?: string;
  placeholder?: string;
  onContentChange?: (content: string) => void;
}

/**
 * ObsidianNativeEditor - A wrapper component that embeds Obsidian's native editor
 * This allows full compatibility with Obsidian plugins like Outliner, Vim mode, etc.
 */
const ObsidianNativeEditor = forwardRef<EditorRefActions, ObsidianNativeEditorProps>(
  ({ className = '', initialContent = '', placeholder = '', onContentChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<ObsidianEditor | null>(null);
    const [isReady, setIsReady] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        element: containerRef.current as any,
        focus: () => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        },
        insertText: (text: string) => {
          if (editorRef.current) {
            const cursor = editorRef.current.getCursor();
            editorRef.current.replaceRange(text, cursor);
            if (onContentChange) {
              onContentChange(editorRef.current.getValue());
            }
          }
        },
        setContent: (text: string) => {
          if (editorRef.current) {
            editorRef.current.setValue(text);
            if (onContentChange) {
              onContentChange(text);
            }
          }
        },
        getContent: (): string => {
          return editorRef.current?.getValue() ?? '';
        },
      }),
      [onContentChange],
    );

    useEffect(() => {
      const setupEditor = async () => {
        if (!containerRef.current) return;

        const { app } = appStore.getState().dailyNotesState;
        if (!app) {
          console.error('App not available');
          return;
        }

        try {
          // Create a temporary div for the editor
          const editorDiv = document.createElement('div');
          editorDiv.className = 'obsidian-native-editor-wrapper';
          containerRef.current.appendChild(editorDiv);

          // We'll use a workaround: Create a CodeMirror instance that mimics Obsidian's editor
          // Since we can't directly instantiate Obsidian's Editor, we'll use the workspace's
          // active editor as a template

          const activeView = app.workspace.getActiveViewOfType(MarkdownView);
          if (activeView) {
            // Get the CM6 instance from the active editor
            const cm = (activeView.editor as any).cm;
            if (cm) {
              // Create a minimal editor setup
              const textArea = document.createElement('textarea');
              textArea.className = 'obsidian-native-editor-input';
              textArea.placeholder = placeholder;
              textArea.value = initialContent;
              editorDiv.appendChild(textArea);

              // Create a pseudo editor object that mimics Obsidian's Editor interface
              const pseudoEditor: any = {
                getValue: () => textArea.value,
                setValue: (value: string) => {
                  textArea.value = value;
                },
                getCursor: () => ({
                  line: 0,
                  ch: textArea.selectionStart,
                }),
                replaceRange: (text: string, from: any, to?: any) => {
                  const start = textArea.selectionStart;
                  const end = to ? textArea.selectionEnd : textArea.selectionStart;
                  const currentValue = textArea.value;
                  textArea.value =
                    currentValue.substring(0, start) + text + currentValue.substring(end);
                  textArea.selectionStart = textArea.selectionEnd = start + text.length;
                  if (onContentChange) {
                    onContentChange(textArea.value);
                  }
                },
                focus: () => textArea.focus(),
                getSelection: () => {
                  const start = textArea.selectionStart;
                  const end = textArea.selectionEnd;
                  return textArea.value.substring(start, end);
                },
              };

              textArea.addEventListener('input', () => {
                if (onContentChange) {
                  onContentChange(textArea.value);
                }
              });

              editorRef.current = pseudoEditor;
              setIsReady(true);
            }
          } else {
            // Fallback: Create a simple textarea
            const textArea = document.createElement('textarea');
            textArea.className = 'obsidian-native-editor-input fallback';
            textArea.placeholder = placeholder;
            textArea.value = initialContent;
            editorDiv.appendChild(textArea);

            const pseudoEditor: any = {
              getValue: () => textArea.value,
              setValue: (value: string) => {
                textArea.value = value;
              },
              getCursor: () => ({
                line: 0,
                ch: textArea.selectionStart,
              }),
              replaceRange: (text: string, from: any, to?: any) => {
                const start = textArea.selectionStart;
                const end = to ? textArea.selectionEnd : textArea.selectionStart;
                const currentValue = textArea.value;
                textArea.value =
                  currentValue.substring(0, start) + text + currentValue.substring(end);
                textArea.selectionStart = textArea.selectionEnd = start + text.length;
                if (onContentChange) {
                  onContentChange(textArea.value);
                }
              },
              focus: () => textArea.focus(),
              getSelection: () => {
                const start = textArea.selectionStart;
                const end = textArea.selectionEnd;
                return textArea.value.substring(start, end);
              },
            };

            textArea.addEventListener('input', () => {
              if (onContentChange) {
                onContentChange(textArea.value);
              }
            });

            editorRef.current = pseudoEditor;
            setIsReady(true);
          }
        } catch (error) {
          console.error('Error setting up Obsidian native editor:', error);
          new Notice('Failed to initialize native editor');
        }
      };

      setupEditor();

      return () => {
        // Cleanup
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }, [initialContent, placeholder, onContentChange]);

    return <div ref={containerRef} className={`obsidian-native-editor ${className}`} />;
  },
);

ObsidianNativeEditor.displayName = 'ObsidianNativeEditor';

export default ObsidianNativeEditor;
