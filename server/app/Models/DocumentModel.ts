import BaseModel from './BaseModel'

class DocumentModel extends BaseModel {
  static tableName = "documents"

  //fields
  id: number;
  name: string;
  content: Array<string>;
  status: number;
  documentTemplateId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export default DocumentModel
