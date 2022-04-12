import React, { useContext, useEffect } from 'react';
// import { locationService, userService } from "../services";
import appContext from '../stores/appContext';
import useLoading from '../hooks/useLoading';
import '../less/home.less';

// import FewArrows from '../components/MemosBoard';

function Home() {
  const {
    locationState: { pathname },
  } = useContext(appContext);
  // const { app } = dailyNotesService.getState();
  const loadingState = useLoading();

  // const refresh = useRefresh();

  useEffect(() => {
    // const { user } = userService.getState();
    // if (!user) {
    //   userService
    //     .doSignIn()
    //     .catch(() => {
    //       // do nth
    //     })
    //     .finally(() => {
    //       // if (userService.getState().user) {
    //         loadingState.setFinish();
    //       // } else {
    //       //   locationService.replaceHistory("/signin");
    //       // }
    //     });
    // } else {
    loadingState.setFinish();

    // }
  }, []);

  return (
    <>
      {/* {loadingState.isLoading ? null : ( */}
      {/* <section id="page-wrapper">
        <Sidebar />
        <main className="content-wrapper">{homeRouterSwitch(pathname)}</main>
      </section> */}
      {/*<FewArrows />*/}
      {/* )} */}
    </>
  );
}

export default Home;
