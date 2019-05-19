// mock tableListDataSource
const tableListDataSource ={
	"data":[
		{
			"authCode":"A",
			"children":[
				{
					"appId":1,
					"authCode":"module_AA",
					"authorityId":1,
					"icon":"dashboard",
					"id":1,
					"isLeaf":1,
					"level":1,
					"mcode":"AA",
					"mcodePath":"|AA|",
					"name":"总经办",
					"sortNo":1,
					"type":2,
					"uri":"myWorkplace"
				},
				{
					"appId":1,
					"authCode":"module_AB",
					"authorityId":4,
					"children":[
						{
							"appId":1,
							"authCode":"module_ABA",
							"authorityId":7,
							"icon":"",
							"id":3,
							"isLeaf":1,
							"level":2,
							"mcode":"ABA",
							"mcodePath":"|AB|ABA|",
							"name":"技术1部",
							"parentCode":"AB",
							"sortNo":1,
							"type":2,
							"uri":"aircompany"
						},
						{
							"appId":1,
							"authCode":"module_ABB",
							"authorityId":8,
							"id":4,
							"isLeaf":1,
							"level":2,
							"mcode":"ABB",
							"mcodePath":"|AB|ABB|",
							"name":"技术2部",
							"parentCode":"AB",
							"sortNo":2,
							"type":2,
							"uri":"submited"
						},
						{
							"appId":1,
							"authCode":"module_ABC",
							"authorityId":9,
							"id":5,
							"isLeaf":1,
							"level":2,
							"mcode":"ABC",
							"mcodePath":"|AB|ABC|",
							"name":"技术3部",
							"parentCode":"AB",
							"sortNo":3,
							"type":2,
							"uri":"listAll"
						}
					],
					"icon":"appstore",
					"id":2,
					"isLeaf":0,
					"level":1,
					"mcode":"AB",
					"mcodePath":"|AB|",
					"name":"技术部",
					"sortNo":2,
					"type":2,
					"uri":"product"
				}
				
			],
			"id":1,
			"mcode":"A",
			"name":"某某公司",
			"sortNo":1,
			"type":1
		},
	],
	"status":true
}

function getManaDept(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const dataSource = tableListDataSource;

  return res.json(dataSource);
}


export default {
  'GET /api/mana/dept': getManaDept,
};
