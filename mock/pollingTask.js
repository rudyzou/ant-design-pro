import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    id: i,
    applyId: `2019010200${i}`,
    lineNo: `${i}号线`,
    startStaName: `虹桥站`,
    endStaName:'人民广场站',
    qmQx: `化学`,
    recCreateDeptName:'部门3',
    operatorId:`OP2019010200${i}`,
    operatorName:`OP${i}`,
    planStartTime:new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    planEndTime:new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    planHour:2,
    actualStartTime:new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    actualEndTime:new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    actualHour:3,
    status:( i % 2 )===0?1:2,
    operatorDeptName:'部门1',
  });
}

function getPollingTask(req, res, u) {
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

export default {
  'POST /api/polling/queryTask': getPollingTask,
};
