import { useRouter } from 'next/router'
import I18n from '@libs/I18n'
import { useDispatch, useSelector } from 'react-redux'
import { setStore as setStoreAction } from '@src/components/Redux/Store'
import _ from 'lodash'
import { notification } from 'antd'
import { makeUrl, getRouteData } from '@src/helpers/routes';
import to from 'await-to-js'

interface BaseBook {
  useSelector: Function,
  router: any,
  t: Function,
  setStore: Function,
  getStore: Function,
  redirect: Function,
  getData: Function,
  notify: Function
  sprintf: Function
  handleApi: Function,
  getCookies: Function
}
const useBaseHooks = (
  {
    lang = ['common'],
  }: { lang?: string[], } = {}): BaseBook => {
  const router = useRouter()
  const translatetion = I18n.useTranslation(lang)
  const dispatch = useDispatch();

  const setStore = async (path: string, value: any): Promise<any> => {
    return dispatch(setStoreAction(path, value))
  }

  const getStore = (path: string): any => {
    return useSelector((state: any) => _.get(state, path))
  }

  const redirect = async (url: string, query: any, shallow: boolean = false) => {
    const routeData = await getRouteData()
    let nextRoute;
    try {
      nextRoute = makeUrl(url, query, routeData)
    }
    catch (e) {
      console.log(url)
      nextRoute = {
        href: url,
        as: url
      }
    }
    console.log(nextRoute)
    router.push(nextRoute.href, nextRoute.as, {
      shallow
    })
  }

  const getData = (obj: any, path: string, defaultValue: any = undefined): any => {
    let value = _.get(obj, path, defaultValue)
    if (value == null) return defaultValue
    return value
  }

  const notify = (message: string, description: string = '', type: "success" | "error" | "warning" = "success"): void => {
    notification[type]({
      message: message,
      description: description,
      duration: 4 //second
    });
  }

  const sprintf = (message: string, keys: any) => {
    const regexp = /{{([^{]+)}}/g;
    let result = message.replace(regexp, function (ignore, key) {
      return (key = keys[key]) == null ? '' : key;
    });
    return result;
  }

  const handleApi =  async (apiFunc) => {
    if(typeof apiFunc !== 'function') return null;

    let [error, result]: any[] = await to(apiFunc());
    if (error) return notify(translatetion.t(`errors:${error.code}`), '', 'error');
    return result
  }

  const getCookies = (): any => {
    return useSelector((state: any) => state.cookies)
  }

  return {
    useSelector,
    router,
    t: translatetion.t,
    setStore,
    getStore,
    redirect,
    getData,
    notify,
    sprintf,
    handleApi,
    getCookies
  };
}

useBaseHooks.getData = (obj: any, path: string, defaultValue: any = undefined): any => {
  let value = _.get(obj, path, defaultValue)
  if (value == null) return defaultValue
  return value
}

export default useBaseHooks
