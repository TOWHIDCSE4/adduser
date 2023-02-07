let controllers = {};
import Exception from '@core/Exception'
import UrlPattern from 'url-pattern';


class Route {
  router: any
  url: string
  action: any
  method: string
  middlewares: any
  _parent: string
  _name: string
  _sidebar: string

  constructor(url, action, method) {
    this.router = require('express').Router();
    this.url = url;
    this.action = action;
    this.method = method;
    this.middlewares = []
  }

  //Route.get().middleware([mid1, mid2....])
  middleware(middlewares) {
    this.middlewares = [
      ...this.middlewares,
      ...middlewares
    ];
    return this
  }

  /**
   * Convert ActionPath sang function
   * UserController.index ==> function index trong UserController.
   */
  getActionFromPath(actionPath, request, response) {
    let [controllerName, actionName] = actionPath.split(".");
    if (controllerName == undefined || actionName == undefined) {
      throw new Error(`Action does not exist: ${actionPath}`)
    }

    try {
      if (!controllers[controllerName]) {
        controllers[controllerName] = require(`@app/Controllers/${controllerName}`).default;
      }

      let controller = new controllers[controllerName]();
      if (typeof controller[actionName] !== "function") {
        throw new Error(`Action does not exist: ${actionPath}`)
      }

      controller.request = request
      controller.response = response
      request.audit = {
        controller: controllerName,
        action: actionName
      }
      return controller[actionName].bind(controller)
    } catch (error) {
      //console.log(error)
      throw error
    }
  }

  /**
   * Hàm tạo ra các router
   */
  build(prefixName, prerixRoute, middlewares = []) {
    if (middlewares.length > 0) {
      this.middlewares = [
        ...middlewares,
        ...this.middlewares
      ]
    }
    //register routename
    let parent = this._parent ? prefixName != null ? `${prefixName}.${this._parent}` : this._parent : undefined
    let url = prerixRoute != null ? `${prerixRoute}/${this.url}` : this.url
    url = url.replace(/\/+/g, '/').replace(/\/+$/, '');
    if (!url) url = '/'

    let route: any = {
      url: url,
      parent: parent,
      action: this.action + "",
      method: this.method,
      middlewares: this.middlewares
    }


    if (this._name != null) {
      let Group = require("./index").default
      let name = prefixName != null ? `${prefixName}.${this._name}` : this._name
      let sidebar = this._sidebar ? prefixName != null ? `${prefixName}.${this._sidebar}` : this._sidebar : name

      route = {
        ...route,
        name: name,
        sidebar: sidebar
      }
      Group.routes = {
        ...Group.routes,
        [name]: route
      }
    }

    this.router[this.method](this.url,
      (request, response, next) => {
        request.route = route
        next()
      },
      ...this.middlewares,
      async (request, response, next) => {
        try {
          let action = this.action;
          if (typeof action === "function") {
            let result = await action({
              request,
              response,
              next
            })
            if (result) {
              response.send(result);
            }
          } else if (action.substr(0, 6) === "pages/") {
            const Server = require('@core/Server').default
            Server.nextApp.render(request, response, action.substr(5), {
              ...request.query,
              ...request.params,
            });
          } else {
            action = this.getActionFromPath(action, request, response);
            let result = await action({
              request,
              response,
              next
            });
            if (result !== false) response.success(result);
            if (!response.headersSent && result !== false) {
              response.end()
            }
          }
        } catch (e) {
          Exception.handle(e, request, response)
        }
      }
    );
    return this.router
  }

  name(routeName) {
    this._name = routeName
    return this
  }
  sidebar(sidebarSelected) {
    this._sidebar = sidebarSelected
    return this
  }
  parent(name) {
    this._parent = name;
    return this
  }
  makeUrl(params) {
    var pattern = new UrlPattern(this.url);
    return pattern.stringify(params)
  }
}

export default Route
