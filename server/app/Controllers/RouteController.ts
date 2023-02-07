import BaseController from './BaseController'
import Route from '@core/Routes'

export default class RouteController extends BaseController {
  async index() {
    let input = this.request.all()
    if (input['key'] === "routeData")
      return this.routeData()
    return;
  }

  async routeData() {
    let data = Route.export()
    return data
  }
}
