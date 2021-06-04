import {editProduct, newCoupon} from "@/services/api";
import {message} from "antd";

export default {
  namespace: 'coupon',

  state: {
    couponCode: ''
  },

  effects: {
    *newCoupon({state, payload}, {call,put}) {
      const response = yield call(newCoupon, payload);
      if(response.code === 0) {
        message.success("创建成功！")
        yield put({
          type: "createCoupon",
          payload: response.data,
        })
      } else {
        message.warning("操作失败");
      }
    },
  },

  reducers: {
    createCoupon(state, {payload}) {
      return {
        ...state,
        couponCode: payload
      }
    },
  }
}
