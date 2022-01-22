import { dailyNotesService } from '../../services';

const cachedResourceMap = new Map<string, string>();

const convertResourceToDataURL = async (url: string, useCache = true): Promise<string> => {
  const { vault } = dailyNotesService.getState().app;

  if (useCache && cachedResourceMap.has(url)) {
    return Promise.resolve(cachedResourceMap.get(url) as string);
  }

  // let res;

  if(await vault.adapter.exists(url)){

    var buffer = await vault.adapter.readBinary(url);
    var arr = new Uint8Array(buffer);

    var blob = new Blob([arr], { type: 'image/png' });
    // var len = arr.byteLength;
    // for (var i = 0; i < len; i++) {
    //     binary += String.fromCharCode( arr[ i ] );
    // }

    // return window.btoa( binary );
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        cachedResourceMap.set(url, base64Url);
        resolve(base64Url);
      };
      reader.readAsDataURL(blob);
    });
    // })
  }else{
    const res = await fetch(url, { mode: 'no-cors'});
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        cachedResourceMap.set(url, base64Url);
        resolve(base64Url);
        console.log(blob);
      };
      reader.readAsDataURL(blob);
    });
  }
};

export default convertResourceToDataURL;
