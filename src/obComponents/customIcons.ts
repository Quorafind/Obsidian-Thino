import { addIcon } from 'obsidian';

const icons: Record<string, string> = {
  ,
};
export default function addIcons() {
  Object.keys(icons).forEach((key) => {
    addIcon(key, icons[key]);
  });
}
