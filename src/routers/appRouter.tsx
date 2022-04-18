import React from 'react';
import Home from '../pages/Home';
import HomeBoard from '../pages/HomeBoard';

const appRouter = {
  '/homeboard': <HomeBoard />,
  '*': <Home />,
};

export default appRouter;
