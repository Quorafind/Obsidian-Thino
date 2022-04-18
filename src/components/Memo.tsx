import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import {
  FIRST_TAG_REG,
  IMAGE_URL_REG,
  LINK_REG,
  MARKDOWN_URL_REG,
  MD_LINK_REG,
  MEMO_LINK_REG,
  TAG_REG,
  WIKI_IMAGE_URL_REG,
} from '../helpers/consts';
import useState from 'react-usestateref';
import { encodeHtml, parseMarkedToHtml, parseRawTextToHtml } from '../helpers/marked';
import utils from '../helpers/utils';
import useToggle from '../hooks/useToggle';
import { globalStateService, memoService, resourceService } from '../services';
import showMemoCardDialog from './MemoCardDialog';
import showShareMemoImageDialog from './ShareMemoImageDialog';
import '../less/memo.less';
import { moment, Notice, Platform } from 'obsidian';
import { showMemoInDailyNotes } from '../obComponents/obShowMemo';
import more from '../icons/more.svg';
import task from '../icons/task.svg';
import taskBlank from '../icons/task-blank.svg';
import comment from '../icons/comment.svg';
import {
  CommentOnMemos,
  CommentsInOriginalNotes,
  DefaultEditorLocation,
  ShowTaskLabel,
  UseButtonToShowEditor,
} from '../memos';
import { t } from '../translations/helper';
import Editor, { EditorRefActions } from './Editor/Editor';
import MemoImage from './MemoImage';
import appContext from '../stores/appContext';
import { getDailyNoteFormat } from '../obComponents/obUpdateMemo';

interface LinkedMemo extends FormattedMemo {
  dateStr: string;
}

interface Props {
  memo: Model.Memo;
}

const Memo: React.FC<Props> = (props: Props) => {
  const { globalState } = useContext(appContext);
  const { memo: propsMemo } = props;
  const memo: FormattedMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const memoCommentRef = useRef<EditorRefActions>(null);
  const [isCommentShown, toggleComment] = useToggle(false);
  const [commentMemos, setCommentMemos, commentMemosRef] = useState<LinkedMemo[]>([]);
  const [, setAddRandomIDflag, RandomIDRef] = useState(false);
  // const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  useEffect(() => {
    if (!memoCommentRef.current) {
      return;
    }
    if (!CommentOnMemos) {
      return;
    }

    const fetchCommentMemos = async () => {
      const allCommentMemos = memoService
        .getState()
        .commentMemos.filter((m) => m.linkId === propsMemo.hasId)
        .sort((a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt))
        .map((m) => ({
          ...m,
          createdAtStr: utils.getDateTimeString(m.createdAt),
          dateStr: utils.getDateString(m.createdAt),
        }));
      // if (allCommentMemos !== memoState.commentMemos) {
      setCommentMemos(allCommentMemos);
      // }
    };

    fetchCommentMemos();
  }, [memo.id, memo.content]);

  useEffect(() => {
    if (!memoCommentRef.current) {
      return;
    }

    // new TagsSuggest(app, memoCommentRef.current.element);

    const handlePasteEvent = async (event: ClipboardEvent) => {
      if (event.clipboardData && event.clipboardData.files.length > 0) {
        event.preventDefault();
        const file = event.clipboardData.files[0];
        const url = await handleUploadFile(file);
        if (url) {
          memoCommentRef.current?.insertText(url);
        }
      }
    };

    const handleDropEvent = async (event: DragEvent) => {
      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const url = await handleUploadFile(file);
        if (url) {
          memoCommentRef.current?.insertText(url);
        }
      }
    };

    const handleClickEvent = () => {
      handleContentChange(memoCommentRef.current?.element.value ?? '');
    };

    const handleKeyDownEvent = () => {
      setTimeout(() => {
        handleContentChange(memoCommentRef.current?.element.value ?? '');
      });
    };

    memoCommentRef.current.element.addEventListener('paste', handlePasteEvent);
    memoCommentRef.current.element.addEventListener('drop', handleDropEvent);
    memoCommentRef.current.element.addEventListener('click', handleClickEvent);
    memoCommentRef.current.element.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      memoCommentRef.current?.element.removeEventListener('paste', handlePasteEvent);
      memoCommentRef.current?.element.removeEventListener('drop', handleDropEvent);
    };
  }, []);

  const handleCancelBtnClick = useCallback(() => {
    globalStateService.setCommentMemoId('');
    memoCommentRef.current?.setContent('');
    toggleComment(false);
    // setEditorContentCache('');
  }, []);

  const handleContentChange = useCallback((content: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    if (tempDiv.innerText.trim() === '') {
      content = '';
    }
    // setEditorContentCache(content);

    setTimeout(() => {
      memoCommentRef.current?.focus();
    });
  }, []);

  const handleSaveBtnClick = useCallback(async (content: string) => {
    if (content === '') {
      new Notice('内容不能为空呀');
      return;
    }

    const { commentMemoId } = globalStateService.getState();
    content = content.replaceAll('&nbsp;', ' ');
    try {
      if (commentMemoId) {
        memoCommentRef.current?.setContent('');
        let prevMemo;
        if (CommentOnMemos && CommentsInOriginalNotes) {
          prevMemo = memoService.getCommentMemoById(commentMemoId);
        } else {
          prevMemo = memoService.getMemoById(commentMemoId);
          content = prevMemo.content.replace(/^(.*) comment:/g, content + ' comment:');
        }

        if (prevMemo && prevMemo.content !== content) {
          let editedMemo: Model.Memo;
          if (CommentOnMemos && CommentsInOriginalNotes) {
            editedMemo = await memoService.updateMemo(
              prevMemo.id,
              prevMemo.content,
              content,
              prevMemo.memoType,
              prevMemo.path,
            );
          } else {
            editedMemo = await memoService.updateMemo(prevMemo.id, prevMemo.content, content, prevMemo.memoType);
          }
          editedMemo.updatedAt = utils.getDateTimeString(Date.now());
          if (CommentOnMemos && CommentsInOriginalNotes) {
            memoService.editCommentMemo(editedMemo);
          } else {
            memoService.editMemo(editedMemo);
          }
          setCommentMemos((commentMemos) => {
            return commentMemos.map((m) => {
              if (m.id === commentMemoId) {
                return {
                  ...editedMemo,
                  createdAtStr: utils.getDateTimeString(m.createdAt),
                  dateStr: utils.getDateString(m.createdAt),
                };
              } else {
                return {
                  ...m,
                  createdAtStr: utils.getDateTimeString(m.createdAt),
                  dateStr: utils.getDateString(m.createdAt),
                };
              }
            });
          });
        }

        globalStateService.setCommentMemoId('');
        toggleComment(false);
      } else {
        const dailyFormat = getDailyNoteFormat();
        let randomId: string;
        if (memo.hasId.length > 0) {
          randomId = memo.hasId;
        } else if (!CommentsInOriginalNotes) {
          randomId = Math.random().toString(36).slice(-6);
          setAddRandomIDflag(true);
        }

        if (!CommentsInOriginalNotes) {
          content = content + ' comment: [[' + moment(memo.id.slice(0, 8)).format(dailyFormat) + '#^' + randomId + ']]';
        }

        // setEditorContentCache('');
        memoCommentRef.current?.setContent('');

        let newMemo: Model.Memo;
        if (CommentsInOriginalNotes) {
          newMemo = await memoService.createCommentMemo(content, true, memo.path, memo.id);
          memoService.pushCommentMemo(newMemo);
        } else {
          newMemo = await memoService.createMemo(content, true);
          memoService.pushMemo(newMemo);
        }
        console.log(commentMemosRef.current);
        const newCommentMemos = commentMemosRef.current.concat({
          ...newMemo,
          createdAtStr: utils.getDateTimeString(newMemo.createdAt),
          dateStr: utils.getDateString(newMemo.createdAt),
        });
        setCommentMemos(
          newCommentMemos.sort((a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt)),
        );
        if (RandomIDRef.current) {
          const editedMemo = await memoService.updateMemo(
            memo.id,
            memo.content,
            memo.content + ' ^' + randomId,
            memo.memoType,
          );
          editedMemo.updatedAt = utils.getDateTimeString(Date.now());
          memoService.editMemo(editedMemo);
          setAddRandomIDflag(false);
        }
      }
    } catch (error: any) {
      new Notice(error.message);
    }

    // setEditorContentCache('');
  }, []);

  const handleUploadFile = useCallback(async (file: File) => {
    const { type } = file;

    if (!type.startsWith('image')) {
      return;
    }

    try {
      const image = await resourceService.upload(file);
      const url = `${image}`;

      return url;
    } catch (error: any) {
      new Notice(error);
    }
  }, []);

  const handleShowMemoStoryDialog = () => {
    showMemoCardDialog(memo);
  };

  const handleMarkMemoClick = () => {
    if (UseButtonToShowEditor && DefaultEditorLocation === 'Bottom') {
      const elem = document.querySelector(
        "div[data-type='memos_view'] .view-content .memo-show-editor-button",
      ) as HTMLElement;
      if (typeof elem.onclick == 'function') {
        elem.onclick.apply(elem);
      }
    }

    globalStateService.setMarkMemoId(memo.id);
  };

  const handleEditMemoClick = () => {
    if (UseButtonToShowEditor && DefaultEditorLocation === 'Bottom' && Platform.isMobile) {
      const elem = document.querySelector(
        "div[data-type='memos_view'] .view-content .memo-show-editor-button",
      ) as HTMLElement;
      if (typeof elem.onclick == 'function') {
        elem.onclick.apply(elem);
      }
    }

    globalStateService.setEditMemoId(memo.id);
  };

  const handleSourceMemoClick = () => {
    showMemoInDailyNotes(memo.id);
  };

  // const handleCreateNewNoteClick = () => {
  //   turnIntoNote(memo.id);
  // };

  const handleDeleteMemoClick = async () => {
    if (showConfirmDeleteBtn) {
      try {
        await memoService.hideMemoById(memo.id);
      } catch (error: any) {
        new Notice(error.message);
      }

      if (globalStateService.getState().editMemoId === memo.id) {
        globalStateService.setEditMemoId('');
      }
    } else {
      toggleConfirmDeleteBtn();
    }
  };

  const handleMouseLeaveMemoWrapper = () => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn(false);
    }
  };

  const handleGenMemoImageBtnClick = () => {
    showShareMemoImageDialog(memo);
  };

  const handleMemoTypeShow = () => {
    if (!ShowTaskLabel) {
      return;
    }

    if (memo.memoType === 'TASK-TODO') {
      return taskBlank;
    } else if (memo.memoType === 'TASK-DONE') {
      return task;
    }
  };

  const handleMemoKeyDown = useCallback((event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      handleSourceMemoClick();
    }
  }, []);

  const handleMemoDoubleClick = useCallback((event: React.MouseEvent) => {
    if (event) {
      handleEditMemoClick();
    }
  }, []);

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === 'memo-link-text') {
      const memoId = targetEl.dataset?.value;
      const memoTemp = memoService.getMemoById(memoId ?? '');

      if (memoTemp) {
        showMemoCardDialog(memoTemp);
      } else {
        new Notice('MEMO Not Found');
        targetEl.classList.remove('memo-link-text');
      }
    } else if (targetEl.className === 'todo-block') {
      // do nth
    }
  };

  const handleCommentBlock = () => {
    if (!isCommentShown) {
      toggleComment(true);
    } else {
      toggleComment(false);
    }
  };

  const handleEditCommentClick = useCallback((memo: Model.Memo) => {
    if (!CommentOnMemos) {
      return;
    }

    globalStateService.setCommentMemoId(memo.id);

    if (!isCommentShown) {
      toggleComment(true);
    }
    memoCommentRef.current?.focus();
    memoCommentRef.current?.setContent(memo.content.replace(/ comment: (.*)$/g, ''));
  }, []);

  const showEditStatus = Boolean(globalState.commentMemoId);

  const editorConfig = useMemo(
    () => ({
      className: 'memo-editor',
      inputerType: 'commentMemo',
      initialContent: '',
      placeholder: t('Comment it...'),
      showConfirmBtn: true,
      showCancelBtn: showEditStatus,
      showTools: true,
      onConfirmBtnClick: handleSaveBtnClick,
      onCancelBtnClick: handleCancelBtnClick,
      onContentChange: handleContentChange,
    }),
    [memo],
  );

  const imageProps = {
    memo: memo.content,
  };

  return (
    <div
      className={`memo-wrapper ${'memos-' + memo.id} ${memo.memoType}`}
      onMouseLeave={handleMouseLeaveMemoWrapper}
      onMouseDown={handleMemoKeyDown}
    >
      <div className="memo-top-wrapper">
        <div className="memo-top-left-wrapper">
          <span className="time-text" onClick={handleShowMemoStoryDialog}>
            {memo.createdAtStr}
          </span>
          <div
            className={`memo-type-img ${
              (memo.memoType === 'TASK-TODO' || memo.memoType === 'TASK-DONE') && ShowTaskLabel ? '' : 'hidden'
            }`}
          >
            <img src={handleMemoTypeShow() ?? ''} alt="memo-type" />
          </div>
        </div>
        <div className="memo-top-right-wrapper">
          {CommentOnMemos ? (
            <div className="comment-button-wrapper">
              <img className="comment-logo" onClick={handleCommentBlock} src={comment} alt="memo-comment" />
              {commentMemos.length > 0 ? <div className="comment-text-count">{commentMemos.length}</div> : null}
            </div>
          ) : (
            ''
          )}
          <div className="btns-container">
            <span className="btn more-action-btn">
              <img className="icon-img" src={more} />
            </span>
            <div className="more-action-btns-wrapper">
              <div className="more-action-btns-container">
                <span className="btn" onClick={handleShowMemoStoryDialog}>
                  {t('READ')}
                </span>
                <span className="btn" onClick={handleMarkMemoClick}>
                  {t('MARK')}
                </span>
                <span className="btn" onClick={handleGenMemoImageBtnClick}>
                  {t('SHARE')}
                </span>
                <span className="btn" onClick={handleEditMemoClick}>
                  {t('EDIT')}
                </span>
                <span className="btn" onClick={handleSourceMemoClick}>
                  {t('SOURCE')}
                </span>
                <span
                  className={`btn delete-btn ${showConfirmDeleteBtn ? 'final-confirm' : ''}`}
                  onClick={handleDeleteMemoClick}
                >
                  {showConfirmDeleteBtn ? t('CONFIRM！') : t('DELETE')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="memo-content-text"
        onClick={handleMemoContentClick}
        onDoubleClick={handleMemoDoubleClick}
        dangerouslySetInnerHTML={{ __html: formatMemoContent(memo.content, memo.id) }}
      ></div>
      <MemoImage {...imageProps} />
      {/*<Only when={externalImageUrls.length > 0}>*/}
      {/*  <div className="images-wrapper">*/}
      {/*    {externalImageUrls.map((imgUrl, idx) => (*/}
      {/*      <Image alt="" key={idx} className="memo-img" imgUrl={imgUrl} referrerPolicy="no-referrer" />*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</Only>*/}
      {/*<Only when={internalImageUrls.length > 0}>*/}
      {/*  <div className="images-wrapper internal-embed image-embed is-loaded">*/}
      {/*    {internalImageUrls.map((imgUrl, idx) => (*/}
      {/*      <Image*/}
      {/*        key={idx}*/}
      {/*        className="memo-img"*/}
      {/*        imgUrl={imgUrl.path}*/}
      {/*        alt={imgUrl.altText}*/}
      {/*        filepath={imgUrl.filepath}*/}
      {/*      />*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</Only>*/}
      {CommentOnMemos ? (
        <div className={`memo-comment-wrapper`}>
          {commentMemos.length > 0 ? (
            <div className={`memo-comment-list`}>
              {/*// TODO*/}
              {commentMemos.map((m, idx) => (
                <div key={idx} className="memo-comment">
                  <div className="memo-comment-time">{m.createdAt}</div>
                  <div className="memo-comment-text" onDoubleClick={() => handleEditCommentClick(m)}>
                    {m.content.replace(/comment:(.*)]]/g, '')}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div className={`memo-comment-inputer ${isCommentShown ? '' : 'hidden'}`}>
            <Editor ref={memoCommentRef} {...editorConfig} />
          </div>
        </div>
      ) : (
        ''
      )}
      {/* <Only when={imageUrls.length > 0}>
        <div className="images-wrapper">
          {imageUrls.map((imgUrl, idx) => (
            <Image className="memo-img" key={idx} imgUrl={imgUrl} />
          ))}
        </div>
      </Only> */}
    </div>
  );
};

export function formatMemoContent(content: string, memoid?: string) {
  content = encodeHtml(content);
  content = parseRawTextToHtml(content)
    .split('<br>')
    .map((t) => {
      return `<p>${t !== '' ? t : '<br>'}</p>`;
    })
    .join('');

  const { shouldUseMarkdownParser, shouldHideImageUrl } = globalStateService.getState();

  if (shouldUseMarkdownParser) {
    content = parseMarkedToHtml(content, memoid);
  }

  if (shouldHideImageUrl) {
    content = content.replace(WIKI_IMAGE_URL_REG, '').replace(MARKDOWN_URL_REG, '').replace(IMAGE_URL_REG, '');
  }

  // console.log(content);

  // 中英文之间加空格
  // if (shouldSplitMemoWord) {
  //   content = content
  //     .replace(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;[\]]+)/g, "$1 $2")
  //     .replace(/([A-Za-z0-9?.,;[\]]+)([\u4e00-\u9fa5])/g, "$1 $2");
  // }

  content = content
    .replace(TAG_REG, "<span class='tag-span'>#$1</span>")
    .replace(FIRST_TAG_REG, "<p><span class='tag-span'>#$2</span>")
    .replace(LINK_REG, "$1<a class='link' target='_blank' rel='noreferrer' href='$2'>$2</a>")
    .replace(MD_LINK_REG, "<a class='link' target='_blank' rel='noreferrer' href='$2'>$1</a>")
    .replace(MEMO_LINK_REG, "<span class='memo-link-text' data-value='$2'>$1</span>")
    .replace(/\^\S{6}/g, '');

  // const contentMark = content.split('');

  // if(/(.*)<a(.*)/g.test(content)){

  // }
  //   for(let i=0; i<content.length;i++){
  //     let mark = false;
  //     let aMark = false;
  //     if(contentMark[i])
  //   }

  const tempDivContainer = document.createElement('div');
  tempDivContainer.innerHTML = content;
  for (let i = 0; i < tempDivContainer.children.length; i++) {
    const c = tempDivContainer.children[i];

    if (c.tagName === 'P' && c.textContent === '' && c.firstElementChild?.tagName !== 'BR') {
      c.remove();
      i--;
      continue;
    }
  }

  return tempDivContainer.innerHTML;
}

export default memo(Memo);
