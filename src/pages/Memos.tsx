import MemoEditor from '../components/MemoEditor';
import MemosHeader from '../components/MemosHeader';
import MemoFilter from '../components/MemoFilter';
import MemoList from '../components/MemoList';
import React from 'react';
import { Platform } from 'obsidian';
import { dailyNotesService } from '../services';

function Memos() {
    const plugin = dailyNotesService.getPlugin();

    if (!Platform.isMobile || !(plugin.settings.DefaultEditorLocation === 'Bottom')) {
        return (
            <>
                <MemosHeader />
                <MemoEditor />
                <MemoFilter />
                <MemoList />
            </>
        );
    }

    return (
        <>
            <MemosHeader />
            <MemoFilter />
            <MemoList />
            <MemoEditor />
        </>
    );
}

export default Memos;
