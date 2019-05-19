// mock tableListDataSource
const tableListDataSource = {
  '1': {
    pageSettings: {
      title: '巡检信息查询',
      filters: [{
          label: "任务编号",
          dataIndex: "applyId",
          type: 'input',
        },
        {
          label: "专业",
          dataIndex: "seqmQxx",
          type: 'select',
          options: [{
              value: 1,
              name: '化学',
            },
            {
              value: 2,
              name: '物理',
            }
          ]
        },
        {
          label: '创建部门',
          dataIndex: 'recCreateDeptName',
          type: 'input',
        }
      ],

      columns: [{
          title: '计划编号',
          dataIndex: 'applyId',
        },
        {
          title: '站点',
          dataIndex: 'startStaName',
        },
        {
          title: '专业',
          dataIndex: 'qmQx',
        },
        {
          title: '计划时间',
          dataIndex: 'planStartTime',
        },
        {
          title: '计划用时',
          dataIndex: 'planHour',
        }, {
          title: '实际时间',
          dataIndex: 'actualStartTime',
        }, {
          title: '实际用时',
          dataIndex: 'actualHour',
        }, {
          title: '创建部门',
          dataIndex: 'recCreateDeptName',
        }, {
          title: '执行部门',
          dataIndex: 'operatorDeptName',
        }, {
          title: '执行人',
          dataIndex: 'operatorName',
        }, {
          title: '状态',
          dataIndex: 'status',}
      ],
      buttons: [],
      queryUrl: '/api/polling/queryTask',
    }
  },
  '2': {
    pageSettings: {
      title: '工程信息查询',
      filters: [{
          label: "工程名",
          dataIndex: "realName",
          type: 'input',
        },
        {
          label: "类型",
          dataIndex: "sex",
          type: 'select',
          options: [{
              value: 1,
              name: '男',
            },
            {
              value: 2,
              name: '女',
            }
          ]
        },
      ],
      columns: [{
        title: '工程名',
        dataIndex: 'realName',
        sort: true,
        render: (v) => {
          return `${v}xxxx`
        },
      }, ],
      buttons: [],
      queryUrl: '/api/mana/user',
    }
  },
  '3': {
    pageSettings: {
      title: '故障信息查询',
      filters: [{
          label: "故障线路",
          dataIndex: "realName",
          type: 'input',
        },
        {
          label: "类型",
          dataIndex: "sex",
          type: 'select',
          options: [{
              value: 1,
              name: '男',
            },
            {
              value: 2,
              name: '女',
            }
          ]
        },
      ],
      columns: [{
        title: '故障线路',
        dataIndex: 'realName',
        sort: true,
        render: (v) => {
          return `${v}xxxx`
        },
      }, ],
      buttons: [],
      queryUrl: '/api/mana/user',
    },
  }
}

function getPageSetting(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const {
    pageId
  } = req.query;
  const dataSource = tableListDataSource[pageId];

  return res.json(dataSource);
}


export default {
  'GET /api/dynamicList/pageSetting': getPageSetting,
};
