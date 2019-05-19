import { stringify } from 'qs';
import request from '@/utils/request';

const apiDomain = 'http://47.101.181.21'  

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function queryUserForMana(params) {
  return request(`/api/mana/user?${stringify(params)}`);
}

export async function queryRoleForMana(params) {
  return request(`/api/mana/role?${stringify(params)}`);
}



/**
  * 菜单接口开始
  * getMenuTree,menuDetail,menuEdit,menuAdd,
  */
 export async function getMenuTree() {
  return request(`/api/mana/menu`);
}
export async function menuDetail(params) {
  return request(`${apiDomain}/api/module/${params.parentId}`);
}
export async function menuEdit(params) {
  return request(`${apiDomain}/api/module`,{
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
export async function menuAdd(params) {
  return request(`${apiDomain}/api/module`,{
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function menuRemove(params) {
  return request(`${apiDomain}/api/module/${params.id}`,{
    method: 'DELETE',
  });
}
  /**
   * 菜单接口结束
   */

   /**
  * 部门接口开始
  * getDeptTree,deptDetail,deptEdit,deptAdd,
  */
 export async function getDeptTree() {
  return request(`/api/mana/dept`);
}
export async function deptDetail(params) {
  return request(`${apiDomain}/api/dept/${params.parentId}`);
}
export async function deptEdit(params) {
  return request(`${apiDomain}/api/dept`,{
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
export async function deptAdd(params) {
  return request(`${apiDomain}/api/dept`,{
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function deptRemove(params) {
  return request(`${apiDomain}/api/dept/${params.id}`,{
    method: 'DELETE',
  });
}
/**
 * 部门接口结束
 */
/**
 * 系统任务接口开始
 */
export async function queryScheduleTask(params) {
  return request(`/api/setting/scheduleTask?${stringify(params)}`);
}
/**
 * 系统任务接口结束
 */

/**
 * 动态模块接口
 */
export async function queryData(params) {
  return request(`${params.queryUrl}`,{
    method: 'POST',
    body: {
      ...params.data,
      method: 'post',
    },
  });
}
export async function getPageSetting(params) {
  return request(`/api/dynamicList/pageSetting?pageId=${params.pageId}`);
}
/**
 * 动态模块接口结束
 */