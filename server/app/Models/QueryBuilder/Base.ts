class Base {
  builder: any
  static knex: any
  constructor(builder) {
    this.builder = builder
  }
  setBuilder(newBuilder) {
    this.builder = newBuilder
    return this
  }
  static init(knex) {
    this.knex = knex
    this.export()
  }
  static get publicMethod() {
    return []
  }
  static export() {
    let instance = this
    for (let method of this.publicMethod) {
      //update for new knex version
      this.knex.QueryBuilder.extend(method, function (...params) {
        let obj = new instance(this)
        return obj[method](...params)
      })
    }
  }
}

export default Base
