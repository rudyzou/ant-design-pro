import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';

const { check } = Authorized;

const menuOriginData = [
  // dashboard
  { path: '/', redirect: '/dashboard/analysis', authority: ['admin', 'user'] },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard/analysis',
        name: 'analysis',
      },
      {
        path: '/dashboard/monitor',
        name: 'monitor',
      },
      {
        path: '/dashboard/workplace',
        name: 'workplace',
      },
    ],
  },
  {
    path: '/polling',
    name: 'polling',
    icon: 'solution',
    routes: [
      {
        path: '/polling/pollingTaskAssign',
        name: 'pollingTaskAssign',
      },
      {
        path: '/polling/myPollingTask',
        name: 'myPollingTask',
      },
    ],
  },
  {
    path: '/query',
    name: 'query',
    icon: 'ordered-list',
    routes: [
      {
        path: '/query/pollingTask/1',
        name: 'pollingTask',
      },
      {
        path: '/query/construction/2',
        name: 'construction',
      },
      {
        path: '/query/breakdown/3',
        name: 'breakdown',
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    icon: 'setting',
    routes: [
      {
        path: '/setting/metaData',
        name: 'metaData',
      },
      {
        path: '/setting/scheduleTask',
        name: 'scheduleTask',
      },
      {
        path: '/setting/reportManager',
        name: 'reportManager',
      },
    ],
  },
  {
    path: '/manager',
    name: 'manager',
    icon: 'team',
    routes: [
      {
        path: '/manager/dept',
        name: 'dept',
      },
      {
        path: '/manager/user',
        name: 'user',
      },
      {
        path: '/manager/role',
        name: 'role',
      },
      {
        path: '/manager/menu',
        name: 'menu',
      },
      {
        path: '/manager/logmana',
        name: 'logmana',
      },
    ],
  },
]

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.mcode || item.name}`;
      } else {
        locale = `menu.${item.mcode || item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, authority, path } = payload;
      const originalMenuData = memoizeOneFormatter(menuOriginData, authority, path);
      const menuData = filterMenuData(originalMenuData);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
