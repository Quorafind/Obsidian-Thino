import { Notice } from 'obsidian';
import { t } from '../../translations/helper';
import { IMAGE_URL_REG } from '../../helpers/consts';

export const getBackgroundFile = async (path: string) => {
    if (/(https|http)/g.test(path)) {
        new Notice(t("Don't support web image yet, please input image path in vault"));
        return;
    }
    if (IMAGE_URL_REG.test(path)) {
        new Notice(t('Ready to convert image into background'));
        const buffer = await app.vault.adapter.readBinary(path);
        const arr = new Uint8Array(buffer);
        const blob = new Blob([arr], { type: 'image/png' });
        return blob;
    }
};
