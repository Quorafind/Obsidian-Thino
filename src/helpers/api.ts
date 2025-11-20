// import utils from "./utils";

import { findQuery } from '../obComponents/obGetQueries';
import { createObsidianQuery } from '../obComponents/obCreateQuery';
import { getMemos } from '../obComponents/obGetMemos';
import { updateObsidianQuery } from '../obComponents/obUpdateQuery';
import { obHideMemo } from '../obComponents/obHideMemo';
import { deleteForever, getDeletedMemos, restoreDeletedMemo } from '../obComponents/obDeleteMemo';
import { deleteQueryForever } from '../obComponents/obDeleteQuery';
import { pinQueryInFile, unpinQueryInFile } from '../obComponents/obPinQuery';

// type ResponseType<T = unknown> = {
//   succeed: boolean;
//   message: string;
//   data: T;
// };

// type RequestConfig = {
//   method: string;
//   url: string;
//   data?: any;
//   dataType?: "json" | "file";
// };

// async function request<T>(config: RequestConfig): Promise<ResponseType<T>> {
//   const { method, url, data, dataType } = config;
//   const requestConfig: RequestInit = {
//     method,
//   };

//   if (data !== undefined) {
//     if (dataType === "file") {
//       requestConfig.body = data;
//     } else {
//       requestConfig.headers = {
//         "Content-Type": "application/json",
//       };
//       requestConfig.body = JSON.stringify(data);
//     }
//   }

//   const response = await fetch(url, requestConfig);
//   const responseData = (await response.json()) as ResponseType<T>;

//   if (!responseData.succeed) {
//     throw responseData;
//   }

//   return responseData;
// }

namespace api {
  export function getUserInfo() {
    // return request<Model.User>({
    //   method: "GET",
    //   url: "/api/user/me",
    // });
  }

  // export function signin(username: string, password: string) {
  //   return request({
  //     method: "POST",
  //     url: "/api/auth/signin",
  //     data: { username, password },
  //   });
  // }

  // export function signup(username: string, password: string) {
  //   return request({
  //     method: "POST",
  //     url: "/api/auth/signup",
  //     data: { username, password },
  //   });
  // }

  // export function signout() {
  //   return request({
  //     method: "POST",
  //     url: "/api/auth/signout",
  //   });
  // }

  //eslint-disable-next-line
  export function checkUsernameUsable(username: string) {
    // return request<boolean>({
    //   method: "POST",
    //   url: "/api/user/checkusername",
    //   data: { username },
    // });
  }

  //eslint-disable-next-line
  export function checkPasswordValid(password: string) {
    // return request<boolean>({
    //   method: "POST",
    //   url: "/api/user/validpassword",
    //   data: { password },
    // });
  }

  //eslint-disable-next-line
  export function updateUserinfo(userinfo: Partial<{ username: string; password: string; githubName: string }>) {
    // return request({
    //   method: "PATCH",
    //   url: "/api/user/me",
    //   data: userinfo,
    // });
  }

  export async function getMyMemos() {
    return await getMemos();

    // return request<Model.Memo[]>({
    //   method: "GET",
    //   url: "/api/memo/all",
    // });
  }

  export function getMyDeletedMemos() {
    return getDeletedMemos();
    // return request<Model.Memo[]>({
    //   method: "GET",
    //   url: "/api/memo/all?deleted=true",
    // });
  }

  // export function createMemo(content: string) {
  //   return createMemos(content);
  //   // return request<Model.Memo>({
  //   //   method: "PUT",
  //   //   url: "/api/memo/",
  //   //   data: { content },
  //   // });
  // }

  //eslint-disable-next-line
  // export function updateMemo(memoId: string, content: string) {
  //   // return request<Model.Memo>({
  //   //   method: "PATCH",
  //   //   url: `/api/memo/${memoId}`,
  //   //   data: { content },
  //   // });
  // }

  //eslint-disable-next-line
  export function hideMemo(memoId: string) {
    return obHideMemo(memoId);
    // return request({
    //   method: "PATCH",
    //   url: `/api/memo/${memoId}`,
    //   data: {
    //     deletedAt: utils.getDateTimeString(Date.now()),
    //   },
    // });
  }

  //eslint-disable-next-line
  export function restoreMemo(memoId: string) {
    return restoreDeletedMemo(memoId);
    // return request({
    //   method: "PATCH",
    //   url: `/api/memo/${memoId}`,
    //   data: {
    //     deletedAt: "",
    //   },
    // });
  }

  //eslint-disable-next-line
  export function deleteMemo(memoId: string) {
    return deleteForever(memoId);
    // return request({
    //   method: "DELETE",
    //   url: `/api/memo/${memoId}`,
    // });
  }

  export function getMyQueries() {
    return findQuery();
    // return request<Model.Query[]>({
    //   method: "GET",
    //   url: "/api/query/all",
    // });
  }

  //eslint-disable-next-line
  export function createQuery(title: string, querystring: string) {
    return createObsidianQuery(title, querystring);
    // return request<Model.Query>({
    //   method: "PUT",
    //   url: "/api/query/",
    //   data: { title, querystring },
    // });
  }

  //eslint-disable-next-line
  export function updateQuery(queryId: string, title: string, querystring: string) {
    return updateObsidianQuery(queryId, title, querystring);
    // return request<Model.Query>({
    //   method: "PATCH",
    //   url: `/api/query/${queryId}`,
    //   data: { title, querystring },
    // });
  }

  //eslint-disable-next-line
  export function deleteQueryById(queryId: string) {
    return deleteQueryForever(queryId);
    // return request({
    //   method: "DELETE",
    //   url: `/api/query/${queryId}`,
    // });
  }

  //eslint-disable-next-line
  export function pinQuery(queryId: string) {
    return pinQueryInFile(queryId);
    // return request({
    //   method: "PATCH",
    //   url: `/api/query/${queryId}`,
    //   data: { pinnedAt: utils.getDateTimeString(Date.now()) },
    // });
  }

  //eslint-disable-next-line
  export function unpinQuery(queryId: string) {
    return unpinQueryInFile(queryId);
    // return request({
    //   method: "PATCH",
    //   url: `/api/query/${queryId}`,
    //   data: { pinnedAt: "" },
    // });
  }

  //eslint-disable-next-line
  // export function uploadFile(formData: FormData) {
  //   // return request<Model.Resource>({
  //   //   method: "PUT",
  //   //   url: "/api/resource/",
  //   //   data: formData,
  //   //   dataType: "file",
  //   // });
  // }
}

export default api;
