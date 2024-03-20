
# 2.3.11

- fix: cannot select time when open calendar suggester
- fix: style when editor is at the bottom of the page

# 2.3.10

- feat: [PRO] support filter in archive/recycle bin view;
- feat: [PRO] support search bar in archive/recycle bin view;
- feat: [PRO/BASIC] support basic search bar in daily thinos dialog;
- style: remove translatex in page wrapper;
- fix: [PRO] should not get archived thino in the thino list;
- feat: [PRO] support bulk delete/archive/restore/copy in all view(after filter);
- fix: [PRO] show day's list and task count correctly;
- style: update the style of default toggle list button, show list icon when select list type;
- feat: [PRO/BASIC] support basic password protection;
- fix: cannot copy id correctly;
- feat: [PRO/BASIC] support better password protection;
- feat: [PRO/BASIC] support lock via command;
- fix: command to lock thino should not show when disabled password protection;
- fix: dropdown menu cannot delete thino correctly;
- fix: don't show password protection modal when password is empty;
- fix: top-right menu delete button should not be influenced by last changed.
- feat: [PRO] support sort order when click on date of agenda;
- feat: [PRO] support share image of agenda view when right-click on the table header.
- fix: cannot edit content after obsidian 1.5.11;
- fix: compatibility issue with before obsidian 1.5.6;
- feat: [PRO] support sort time when in agenda view;
- fix: cannot edit thino correctly after obsidian 1.5.11;
- feat: [PRO] support chat view mode;
- style: fix some issue related to chat view;
- feat: [PRO] enable switch chat or list mode when is mobile view;
- style: [PRO] update chat view style; 
- style: [PRO] update chat view style;
- style: [PRO] time stamp show near the message now;

# 2.3.9

- feat: [PRO] support select thino source or thino type in table view;
- fix: [PRO] don't show JOURNAL icon correctly;
- feat: [PRO] support custom time mark range like day/week/month/year;

# 2.3.8

- fix: heatmap should not show deleted thinos;
- fix: [PRO] fix base64 issue with CJK characters;

# 2.3.7

- chore: keep console.error to show status when thino loaded;

# 2.3.6

- fix: storage issue to cause the thino crash;

# 2.3.5

- fix: [PRO] reg code will not be saved correctly;
- chore: [PRO] update reg code validation system;

# 2.3.4

- feat: [PRO/BASIC] support toggle check box in daily thinos dialog;
- style: update the style to use var(--font-size-medium), which is default 15px;
- fix: show the count of thinos in user banner;
- feat: [PRO/BASIC] support navigation from other view to Thino view, and support navigation from Thino view to other view; (Toggle in settings)
- fix: block id would not be deleted when content is updated;
- fix: influx plugin should not be shown in the editor;
- feat: [PRO/BASIC] support task type filter & source type filter;
- feat: [PRO/BASIC] support checkbox type to be shown in the thino card;
  - style: support custom style for checkbox;
- fix: filter dialog would be closed when title is empty;
- fix: [PRO] global copy is not working.
- feat: [PRO/BASIC] you can set open thino view when open obsidian on desktop or mobile;
- feat: [PRO/BASIC] support open note in current thino view;
- fix: [PRO/BASIC] search should not be case-sensitive;
