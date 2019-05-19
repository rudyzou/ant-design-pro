export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [{
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Login'
      },
      {
        path: '/user/register',
        name: 'register',
        component: './User/Register'
      },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      {
        path: '/',
        redirect: '/dashboard/analysis',
        authority: ['admin', 'user']
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [{
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      {
        path: '/polling',
        name: 'polling',
        icon: 'solution',
        routes: [{
            path: '/polling/pollingTaskAssign',
            name: 'pollingTaskAssign',
            component: './Polling/PollingTaskAssign',
          },
          {
            path: '/polling/myPollingTask',
            name: 'myPollingTask',
            component: './Polling/MyPollingTask',
          },
        ],
      }, {
        path: '/setting',
        routes: [{
            path: '/setting/scheduleTask',
            component: './setting/ScheduleTask',
          },
          {
            path: '/setting/metaData/:pageId',
            component: './DynamicList/List'
          },
        ],
      },
      {
        path: '/query',
        routes: [{
            path: '/query/pollingTask/:pageId',
            component: './DynamicList/List'
          },
          {
            path: '/query/construction/:pageId',
            component: './DynamicList/List'
          },
          {
            path: '/query/breakdown/:pageId',
            component: './DynamicList/List'
          },
        ],
      },
      {
        path: '/manager',
        name: 'manager',
        routes: [{
            path: '/manager/user',
            component: './manager/User',
          },
          {
            path: '/manager/menu',
            component: './manager/Menu',
          },
          {
            path: '/manager/role',
            component: './manager/Role',
          },
          {
            path: '/manager/dept',
            component: './manager/dept',
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
