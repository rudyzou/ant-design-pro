import { queryData,getPageSetting } from '@/services/api';

export default {
  namespace: 'dynamicList',

  state: {
    pageSettings:{
      title:'',
      filters:[],
      colums:[],
      buttons:[],
      queryUrl:'',
    },
    data:{
      list: [],
      pagination: {},
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getPageSetting({ payload,cabk }, { call, put }) {
      yield put({
        type: 'cleanData',
      });
      const response = yield call(getPageSetting, payload);
      yield put({
        type: 'savePageSettings',
        payload: response,
      });
      if(cabk)cabk(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savePageSettings(state, action) {
      return {
        ...state,
        pageSettings: action.payload.pageSettings,
      };
    },
    cleanData(state){
      return {
        ...state,
        data:{
          list: [],
          pagination: {},
        }
      };
    }
  },
};
