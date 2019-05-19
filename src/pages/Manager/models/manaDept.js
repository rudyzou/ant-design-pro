import { getDeptTree,deptRemove,deptDetail,deptEdit,deptAdd } from '@/services/api';

export default {
  namespace: 'manaDept',
  state: {
    deptTreeData:[],
    detail:{},
    loading: true,
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getDeptTree, payload);
      if (response.status) {
        yield put({
          type: 'save',
          payload: {
            deptTreeData: response.data,
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
    *deptAdd({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(deptAdd, payload);
      if(callback){
        callback(response);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *deptDetail({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(deptDetail, payload);
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
    *deptEdit({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(deptEdit, payload);
      if(callback){
        callback(response);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *deptRemove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(deptRemove, payload);
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
