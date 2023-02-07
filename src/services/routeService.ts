import Base from './baseService'

class RouteService extends Base {
  getRouteData = async () => {
    return this.request({
      url: '/api/v1/routes',
      method: "GET",
      data: {
        key: "routeData"
      }
    })
  }
}

export default () => new RouteService()