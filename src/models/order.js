import {getOrderDetail, getOrderPage, getProductPage, updateOrderStatus, updateStatus} from "@/services/api";
import {message} from "antd";
import {addKey} from "@/utils/dataClean";

export default {
  namespace: 'order',

  state: {
    orderPage: {},
    orderDetail: {},
    isSuccess: false
  },

  effects: {
    *getOrderPage({state, payload}, {call,put}) {
      const response = yield call(getOrderPage, payload);
      if(response.code === 0) {
        yield put({
          type: "searchOrderPage",
          payload: response.data,
        })
      } else {
        message.warning("错误");
      }
    },
    *getOrderDetail({state, payload}, {call,put}) {
      const response = yield call(getOrderDetail, payload);
      if(response.code === 0) {
        yield put({
          type: "searchOrderDetail",
          payload: response.data,
        })
      } else {
        message.warning(response.message);
      }
    },
    *updateStatus({state, payload}, {call,put}) {
      const response = yield call(updateOrderStatus, payload);
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
    searchOrderPage(state, {payload}) {
      let data = addKey(payload.data);
      return {
        ...state,
        orderPage: {...payload,data}
      }
    },
    searchOrderDetail(state, {payload}) {
      const orderDetailList = addKey(payload.orderDetailList);
      console.log(orderDetailList);
      return {
        ...state,
        orderDetail: {...payload, orderDetailList}
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
