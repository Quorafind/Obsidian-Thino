import { showDialog } from './Dialog';
import '../less/about-site-dialog.less';
import React from 'react';
import close from '../icons/close.svg';

interface Props extends DialogProps {}

const AboutSiteDialog: React.FC<Props> = ({ destroy }: Props) => {
  const handleCloseBtnClick = () => {
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🤠</span>About <b>Obsidian-Memos</b>
        </p>
        <button className="btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src={close} />
        </button>
      </div>
      <div className="dialog-content-container">
        Hi, I am Quorafind(Boninall), if you are interested in this project, please support my work and enthusiasm by
        buying me a coffee on <a href="https://www.buymeacoffee.com/boninall">https://www.buymeacoffee.com/boninall</a>
        <a href="https://www.buymeacoffee.com/boninall">
          <img
            src={`https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=boninall&button_colour=6495ED&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00`}
          />
        </a>
        <br />
        <p>
          基于 <a href="https://github.com/justmemos/memos">memos</a> 开源项目所构建的项目。 NOTE: Based on{' '}
          <a href="https://github.com/justmemos/memos">memos</a> project to build.
        </p>
        <br />
        <p>
          🏗 This project is working in progress, <br /> and very pleasure to welcome your{' '}
          <a href="https://github.com/Quorafind/obsidian-memos/issues">issues</a> and{' '}
          <a href="https://github.com/Quorafind/obsidian-memos/pulls">Pull Request</a>.
        </p>
        <hr />
        <p className="normal-text">
          Last updated on <span className="pre-text">2022/01/04 22:55:15</span> 🎉
        </p>
      </div>
    </>
  );
};

export default function showAboutSiteDialog(): void {
  showDialog(
    {
      className: 'about-site-dialog',
    },
    AboutSiteDialog,
  );
}
