import { makeStore, setStore } from './Store'
import { createWrapper } from "next-redux-wrapper";

const wrapper = createWrapper<any>(makeStore);
export default wrapper;
//export default withRedux(makeStore)(StoreProvider)