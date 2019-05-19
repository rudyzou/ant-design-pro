import { getMenuTree,menuRemove,menuDetail,menuEdit,menuAdd } from '@/services/api';

export default {
  namespace: 'menuMana',
  state: {
    menuTreeData:[],
    detail:{},
    loading: true,
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getMenuTree, payload);
      if (response.status) {
        yield put({
          type: 'save',
          payload: {
            menuTreeData: response.data,
          },
        });
      } else {
        console.log(response.msg);
      }
      if(callback) callback(response);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *menuAdd({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(menuAdd, payload);
      if(callback){
        callback(response);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *menuDetail({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(menuDetail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response.data,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },
    *menuEdit({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(menuEdit, payload);
      if(callback){
        callback(response);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *menuRemove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(menuRemove, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
