import { forwardRef, ReactNode, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import TinyUndo from "tiny-undo";
import appContext from "../../stores/appContext";
import { storage, remove } from '../../helpers/storage';
import useRefresh from "../../hooks/useRefresh";
import Only from "../common/OnlyWhen";
import "../../less/editor.less";
import React from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import { usedTags } from '../../obComponents/obTagSuggester';
import "../../less/suggest.less";
import { SaveMemoButtonLabel } from "../../memos";

type ItemProps = {
  entity: {
    char: string,
    name: string
  }
};

type LoadingProps = {
  data: Array<{ name: string, char: string }>
};

export interface EditorRefActions {
  element: HTMLTextAreaElement;
  focus: FunctionType;
  insertText: (text: string) => void;
  setContent: (text: string) => void;
  getContent: () => string;
}

interface EditorProps {
  className: string;
  initialContent: string;
  placeholder: string;
  showConfirmBtn: boolean;
  showCancelBtn: boolean;
  tools?: ReactNode;
  onConfirmBtnClick: (content: string) => void;
  onCancelBtnClick: () => void;
  onContentChange: (content: string) => void;
}

//eslint-disable-next-line
const Item = ({ entity: { name, char } }: ItemProps) => { return <div>{`${char}`}</div>};
//eslint-disable-next-line
const Loading = ({ data }: LoadingProps) => { return <div>Loading</div> };

export let editorInput: HTMLTextAreaElement;

// eslint-disable-next-line react/display-name
const Editor = forwardRef((props: EditorProps, ref: React.ForwardedRef<EditorRefActions>) => {
  const {
    globalState: { useTinyUndoHistoryCache },
  } = useContext(appContext);
  const {
    className,
    initialContent,
    placeholder,
    showConfirmBtn,
    showCancelBtn,
    onConfirmBtnClick: handleConfirmBtnClickCallback,
    onCancelBtnClick: handleCancelBtnClickCallback,
    onContentChange: handleContentChangeCallback,
  } = props;
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const tinyUndoRef = useRef<TinyUndo | null>(null);
  const refresh = useRefresh();
  // const [value, setValue] = useState("")
  
  let actualToken: string;
  
  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (initialContent) {
      editorRef.current.value = initialContent;
      refresh();
    }
  }, []);

  useEffect(() => {
    if (useTinyUndoHistoryCache) {
      if (!editorRef.current) {
        return;
      }

      const { tinyUndoActionsCache, tinyUndoIndexCache } = storage.get(["tinyUndoActionsCache", "tinyUndoIndexCache"]);

      tinyUndoRef.current = new TinyUndo(editorRef.current, {
        interval: 5000,
        initialActions: tinyUndoActionsCache,
        initialIndex: tinyUndoIndexCache,
      });

      tinyUndoRef.current.subscribe((actions, index) => {
        storage.set({
          tinyUndoActionsCache: actions,
          tinyUndoIndexCache: index,
        });
      });

      return () => {
        tinyUndoRef.current?.destroy();
      };
    } else {
      tinyUndoRef.current?.destroy();
      tinyUndoRef.current = null;
      storage.remove(["tinyUndoActionsCache", "tinyUndoIndexCache"]);
    }
  }, [useTinyUndoHistoryCache]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = "auto";
      editorRef.current.style.height = (editorRef.current.scrollHeight ?? 0) + "px";
    }
  }, [editorRef.current?.value]);

  useImperativeHandle(
    ref,
    () => ({
      element: editorRef.current as HTMLTextAreaElement,
      focus: () => {
        editorRef.current?.focus();
      },
      insertText: (rawText: string) => {
        if (!editorRef.current) {
          return;
        }

        const prevValue = editorRef.current.value;
        editorRef.current.value =
          prevValue.slice(0, editorRef.current.selectionStart) + rawText + prevValue.slice(editorRef.current.selectionStart);
        handleContentChangeCallback(editorRef.current.value);
        refresh();
      },
      setContent: (text: string) => {
        if (editorRef.current) {
          editorRef.current.value = text;
          handleContentChangeCallback(editorRef.current.value);
          refresh();
        }
      },
      getContent: (): string => {
        return editorRef.current?.value ?? "";
      },
    }),
    []
  );

  const handleInsertTrigger = (event: { currentTrigger: string; item: string}) => {
    if (!editorRef.current) {
      return;
    }

    const prevValue = editorRef.current.value;
    let removeCharNum;
    if(actualToken !== null){
      removeCharNum = actualToken.length;
    }else{
      removeCharNum = 0;
    }
    let behindCharNum = editorRef.current.selectionStart;
    for(let i = 0; i < prevValue.length;i++){
      if(prevValue[behindCharNum] !== " " ){
        behindCharNum++;
      }
    }

    editorRef.current.value =
    //eslint-disable-next-line
      prevValue.slice(0, editorRef.current.selectionStart - removeCharNum) + event.item.char + prevValue.slice(behindCharNum);
    handleContentChangeCallback(editorRef.current.value);
    refresh();
  }

  const handleEditorInput = useCallback(() => {
    handleContentChangeCallback(editorRef.current?.value ?? "");
    refresh();
  }, []);

  const handleEditorKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();

    if (event.code === "Enter") {
      if (event.metaKey || event.ctrlKey) {
        handleCommonConfirmBtnClick();
      }
    }
    refresh();
  }, []);

  const handleCommonConfirmBtnClick = useCallback(() => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.value = getEditorContentCache();

    handleConfirmBtnClickCallback(editorRef.current.value);
    editorRef.current.value = "";

    refresh();
    // After confirm btn clicked, tiny-undo should reset state(clear actions and index)
    tinyUndoRef.current?.resetState();
  }, []);

  const handleCommonCancelBtnClick = useCallback(() => {
    handleCancelBtnClickCallback();
  }, []);

  const getEditorContentCache = (): string => {
    return storage.get(["editorContentCache"]).editorContentCache ?? "";
  }

  const getEditorContent = (): string => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.value = getEditorContentCache();
    
    return editorRef.current.value;
  }

  return (
    <div className={"common-editor-wrapper " + className}>
      <ReactTextareaAutocomplete
          autoFocus
          className="common-editor-inputer scroll"
          loadingComponent={Loading}
          placeholder={placeholder}
          movePopupAsYouType={true}
          // renderToBody={true}

          ref={rta => {
            rta = rta;
          }}
          value={getEditorContent()}
          innerRef={textarea => {
            editorRef.current = textarea;
          }}
          onInput={handleEditorInput}
          onKeyDown={handleEditorKeyDown}
          style={{
            minHeight: 48,
          }}
          dropdownStyle={{
            minWidth: 180,
            maxHeight: 250,
            overflowY: "auto",
          }}
          minChar={0}
          onItemSelected={handleInsertTrigger}
          scrollToItem={true}

          trigger={{
            "#": {
              dataProvider: token => {
                actualToken = token;
                return usedTags(token)
                  .map(({ name, char }) => ({ name, char }));
              },
              //eslint-disable-next-line
              component: Item,
              afterWhitespace: true,
              output: (item) => item.char,
            },
            // "[[": {
            //   dataProvider: token => {
            //     actualToken = token;
            //     return usedTags(token)
            //       .slice(0, 10)
            //       .map(({ name, char }) => ({ name, char }));
            //   },
            //   //eslint-disable-next-line
            //   component: Item,
            //   afterWhitespace: true,
            //   output: (item, trigger) => item.char,
            // }
          }
        }
        />
      <div className="common-tools-wrapper">
        <div className="common-tools-container">
          <Only when={props.tools !== undefined}>{props.tools}</Only>
        </div>
        <div className="btns-container">
          <Only when={showCancelBtn}>
            <button className="action-btn cancel-btn" onClick={handleCommonCancelBtnClick}>
              CANCEL EDIT
            </button>
          </Only>
          <Only when={showConfirmBtn}>
            <button className="action-btn confirm-btn" disabled={!editorRef.current?.value} onClick={handleCommonConfirmBtnClick}>
              {SaveMemoButtonLabel}<span className="icon-text">✍️</span>
            </button>
          </Only>
        </div>
      </div>
    </div>
  );
});



export default Editor;