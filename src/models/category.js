import {delCategory, editCategory, getCategoryList, newCategory} from "@/services/api";
import {message} from "antd";
import {addKey} from "@/utils/dataClean";

export default {
  namespace: 'category',

  state: {
    categoryList: [],
    isSuccess: false
  },

  effects: {
    *getCategoryList({state, payload}, {call,put}) {
      const response = yield call(getCategoryList, payload);
      if(response.code === 0) {
        yield put({
          type: "searchCategoryList",
          payload: response.data,
        })
      } else {
        message.warning("错误");
      }
    },
    *newCategory({state, payload}, {call,put}) {
      const response = yield call(newCategory, payload);
      if(response.code === 0) {
        message.success("操作成功！");
        yield put({
          type: "modifyStatus",
          payload: true,
        })
      } else {
        message.warning("操作失败");
        yield put({
          type: "modifyStatus",
          payload: false,
        })
      }
    },
    *editCategory({state, payload}, {call,put}) {
      const response = yield call(editCategory, payload);
      if(response.code === 0) {
        message.success("操作成功！");
        yield put({
          type: "modifyStatus",
          payload: true,
        })
      } else {
        message.warning("操作失败");
        yield put({
          type: "modifyStatus",
          payload: false,
        })
      }
    },
    *delCategory({state, payload}, {call,put}) {
      const response = yield call(delCategory, payload);
      if(response.code === 0) {
        message.success("操作成功！");
        yield put({
          type: "modifyStatus",
          payload: true,
        })
      } else {
        message.warning("操作失败");
        yield put({
          type: "modifyStatus",
          payload: false,
        })
      }
    },
  },

  reducers: {
    searchCategoryList(state, {payload}) {
      let categoryList = addKey(payload);
      return {
        ...state,
        categoryList
      }
    },
    modifyStatus(state, {payload}) {
      return {
        ...state,
        isSuccess: payload
      }
    },
  }
}
