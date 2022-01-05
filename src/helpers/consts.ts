// 移动端样式适配额外类名
export const SHOW_SIDERBAR_MOBILE_CLASSNAME = "mobile-show-sidebar";

// 默认动画持续时长
export const ANIMATION_DURATION = 200;

// toast 动画持续时长
export const TOAST_ANIMATION_DURATION = 400;

// 一天的毫秒数
export const DAILY_TIMESTAMP = 3600 * 24 * 1000;

// 标签 正则
export const TAG_REG = /\s#(.+?)(?:(\s|$))/g;
export const FIRST_TAG_REG = /(?<=(p>))#(.+?)(?:(\s|$))/g;
export const NOP_FIRST_TAG_REG = /^#(.+?)(?:(\s|$))/g;

// URL 正则
export const LINK_REG = /(https?:\/\/[^\s<\\*>']+)/g;

// 图片 正则
export const IMAGE_URL_REG = /([^\s<\\*>']+\.(jpeg|jpg|gif|png|svg))(\]\])?(\))?/g;

// Markdown 内部图片正则 
// Group 1 为图片
// Group 2 为缩放比例
export const MARKDOWN_URL_REG = /(!\[([^\]]*)(\|)?(.*?)\]\((.*?)("(?:.*[^"])")?\s*\))/g;

// 检测是否为外部图片
//eslint-disable-next-line
export const MARKDOWN_WEB_URL_REG = /(http[s]?:\/\/)([^\/\s]+\/)(.*?)(jpeg|jpg|gif|png|svg|bmp|wepg)(?!\))/g;

///(?<=\[)((.*?)\|(.*?))(?=\])/g

// Wiki 图片正则
// Group 1 为图片
// Group 5 为缩放比例
export const WIKI_IMAGE_URL_REG = /!\[\[((.*?)\.(jpeg|jpg|gif|png|svg|bmp|wepg))?(\|)?(.*?)\]\]/g;

// memo 关联正则
export const MEMO_LINK_REG = /\[@(.+?)\]\((.+?)\)/g;


// Internal 