import {
  delProduct,
  editProduct,
  getProduct,
  getProductPage,
  getShopList,
  newCategory,
  newProduct, updateProductStatus
} from "@/services/api";
import {message} from "antd";
import {addKey} from "@/utils/dataClean";

export default {
  namespace: 'product',

  state: {
    productPage: {},
    productInfo: {}
  },

  effects: {
    *getProductPage({state, payload}, {call,put}) {
      const response = yield call(getProductPage, payload);
      if(response.code === 0) {
        yield put({
          type: "searchProductPage",
          payload: response.data,
        })
      } else {
        message.warning("错误");
      }
    },
    *getProduct({state, payload}, {call,put}) {
      const response = yield call(getProduct, payload);
      if(response.code === 0) {
        yield put({
          type: "searchProduct",
          payload: response.data,
        })
      } else {
        message.warning("操作失败");
      }
    },
    *newProduct({state, payload}, {call,put}) {
      const response = yield call(newProduct, payload);
      if(response.code === 0) {
        message.success("新增成功！")
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
    *editProduct({state, payload}, {call,put}) {
      const response = yield call(editProduct, payload);
      if(response.code === 0) {
        message.success("更新成功！")
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
    *delProduct({state, payload}, {call,put}) {
      const response = yield call(delProduct, payload);
      if(response.code === 0) {
        message.success("更新成功！")
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
    *updateProductStatus({state, payload}, {call,put}) {
      const response = yield call(updateProductStatus, payload);
      if(response.code === 0) {
        message.success("更新成功！")
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
    searchProductPage(state, {payload}) {
      let data = addKey(payload.data);
      return {
        ...state,
        productPage: {...payload,data}
      }
    },
    searchProduct(state, {payload}) {
      return {
        ...state,
        productInfo: payload
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
