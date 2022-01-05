const cachedResourceMap = new Map<string, string>();

const convertResourceToDataURL = async (url: string, useCache = true): Promise<string> => {
  if (useCache && cachedResourceMap.has(url)) {
    return Promise.resolve(cachedResourceMap.get(url) as string);
  }

  // let res;

  if(/app/g.test(url)){
    return url;
  }else{
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        cachedResourceMap.set(url, base64Url);
        resolve(base64Url);
      };
      reader.readAsDataURL(blob);
    });
  }


};

export default convertResourceToDataURL;
