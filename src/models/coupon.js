import {editProduct, newCoupon} from "@/services/api";
import {message} from "antd";

export default {
  namespace: 'coupon',

  state: {
    isSuccess: false,
    couponCode: ''
  },

  effects: {
    *newCoupon({state, payload}, {call,put}) {
      const response = yield call(newCoupon, payload);
      if(response.code === 0) {
        message.success("创建成功！")
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
    modifyStatus(state, {payload}) {
      return {
        ...state,
        isSuccess: payload
      }
    },
  }
}
