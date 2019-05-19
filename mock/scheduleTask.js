import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `任务${i}`,
    type: `类型${i}`,
    creator: `user${i}`,
    validTimeBgn: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    validTimeEnd: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    status: ( i % 2 )===0?1:0,
    lastExcTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
  });
}

function getScheduleTask(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postScheduleTask(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        id: i,
        name: `任务${i}`,
        type: `类型${i}`,
        creator: `user${i}`,
        validTimeBgn: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
        validTimeEnd: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
        status: ( i % 2 )===0?1:0,
        lastExcTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getScheduleTask(req, res, u);
}

export default {
  'GET /api/setting/scheduleTask': getScheduleTask,
  'POST /api/setting/scheduleTask': postScheduleTask,
};
