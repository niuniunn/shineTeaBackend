import {getMemberPage, getProductPage} from "@/services/api";
import {message} from "antd";
import {addKey} from "@/utils/dataClean";

export default {
  namespace: 'member',

  state: {
    memberPage: {}
  },

  effects: {
    *getMemberPage({state, payload}, {call,put}) {
      const response = yield call(getMemberPage, payload);
      if(response.code === 0) {
        yield put({
          type: "searchMemberPage",
          payload: response.data,
        })
      } else {
        message.warning("错误");
      }
    },
  },

  reducers: {
    searchMemberPage(state, {payload}) {
      let data = addKey(payload.data);
      return {
        ...state,
        memberPage: {...payload,data}
      }
    },
  }
}
