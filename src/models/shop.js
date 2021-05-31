import {editShop, findShopById, getShopList, newShop, updateStatus} from "@/services/api";
import {message} from "antd";
import {addKey} from "@/utils/dataClean";

export default {
  namespace: "shop",

  state: {
    shopPage: {},
    isSuccess: false,
    shopInfo: {}
  },
  effects: {
    *getShopList({state, payload}, {call,put}) {
      const response = yield call(getShopList, payload);
      if(response.code === 0) {
        yield put({
          type: "searchShopList",
          payload: response.data,
        })
      } else {
        message.warning("错误");
      }
    },
    *newShop({state, payload}, {call,put}) {
      const response = yield call(newShop, payload);
      if(response.code === 0) {
        message.success("添加成功！");
        yield put({
          type: "modifyStatus",
          payload: true,
        })
      } else {
        message.warning("添加失败");
        yield put({
          type: "modifyStatus",
          payload: false,
        })
      }
    },
    *editShop({state, payload}, {call,put}) {
      const response = yield call(editShop, payload);
      if(response.code === 0) {
        message.success("编辑成功！");
        yield put({
          type: "modifyStatus",
          payload: true,
        })
      } else {
        message.warning("编辑失败");
        yield put({
          type: "modifyStatus",
          payload: false,
        })
      }
    },
    *updateStatus({state, payload}, {call,put}) {
      const response = yield call(updateStatus, payload);
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
    *findShopById({state, payload}, {call,put}) {
      const response = yield call(findShopById, payload);
      if(response.code === 0) {
        yield put({
          type: "findShop",
          payload: response.data,
        })
      } else {
        message.warning("查询失败");
      }
    },
  },
  reducers: {
    searchShopList(state, {payload}) {
      let data = addKey(payload.data);
      return {
        ...state,
        shopPage: {...payload,data}
      }
    },
    modifyStatus(state, {payload}) {
      return {
        ...state,
        isSuccess: payload
      }
    },
    findShop(state, {payload}) {
      return {
        ...state,
        shopInfo: payload
      }
    }
  }
}
