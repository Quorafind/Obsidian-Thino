import MemoEditor from '../components/MemoEditor';
import MemosHeader from '../components/MemosHeader';
import MemoFilter from '../components/MemoFilter';
import MemoList from '../components/MemoList';
import React from 'react';
import { Platform } from 'obsidian';
import { DefaultEditorLocation } from '../memos';

function Memos() {
  if (Platform.isMobile && DefaultEditorLocation === 'Bottom') {
    return (
      <>
        <MemosHeader />
        <MemoFilter />
        <MemoList />
        <MemoEditor />
      </>
    );
  } else {
    return (
      <>
        <MemosHeader />
        <MemoEditor />
        <MemoFilter />
        <MemoList />
      </>
    );
  }
}

export default Memos;
