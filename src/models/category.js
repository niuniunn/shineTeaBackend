import {getCategoryList} from "@/services/api";
import {message} from "antd";
import {addKey} from "@/utils/dataClean";

export default {
  namespace: 'category',

  state: {
    categoryList: [],
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
  },

  reducers: {
    searchCategoryList(state, {payload}) {
      let categoryList = addKey(payload);
      return {
        ...state,
        categoryList
      }
    },
  }
}
