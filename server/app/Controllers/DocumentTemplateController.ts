import BaseController from './BaseController'
import DocumentTemplateModel from '@root/server/app/Models/DocumentTemplateModel'
import UserModel from '@root/server/app/Models/UserModel'
import ApiException from '@app/Exceptions/ApiException'

export default class DocumentTemplateController extends BaseController {
    Model: any = DocumentTemplateModel
    UserModel: any = UserModel

  async index() {
    const data = this.request.all()
    let result = await this.Model.query().getForGridTable(data);
    return result;
  }

  async detail({ allowFields = '*' }) {
    let params = this.request.all()
    let id = params.id
    if (!id) throw new ApiException(9996, "ID is required!");
    let result = await this.Model.query().findById(id, allowFields);
    if (!result) {
      throw new ApiException(7002, 'Data not found')
    }
    return result
  }

  async store() {
    let inputs = this.request.all()
    const allowFields = {
      name: "string!",
      locale: "string!",
      createDocumentTemplates: [
        {
          fieldName: "string!",
          label: "string!",
          dataType: "string!",
          inputType: "string!",
          list: "object",
          groupTitle: 'string!',
          position: "number!",
          col: "object!",
          validations: "object!",
        }
      ]
    }
    let data = this.validate(inputs, allowFields, { removeNotAllow: true });

    data['content'] = JSON.stringify(data['createDocumentTemplates']);
    delete data['createDocumentTemplates'];

    console.log(data)

    let result = await this.Model.insertOne(data);
    return result
  }

  async update({ allowFields = {} } = {}) {
    let inputs = this.request.all()
    let data = this.validate(inputs, allowFields, { removeNotAllow: false });
    let id = data.id;
    delete data.id

    return await this.Model.query().patchAndFetchById(id, data)
  }
}
