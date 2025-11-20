import React from 'react';
import Memos from '../pages/Memos';
import MemoTrash from '../pages/MemoTrash';
import MemoArchive from '../pages/MemoArchive';
import Setting from '../pages/Setting';

const homeRouter = {
  '/archive': <MemoArchive />,
  '/recycle': <MemoTrash />,
  '/setting': <Setting />,
  '*': <Memos />,
};

export default homeRouter;
