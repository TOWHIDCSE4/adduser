import BaseModel from './BaseModel'

class DocumentTemplateModel extends BaseModel {
  static tableName = "document_templates";

	//fields
	id: number;
	name: string;
	description: string;
	content: Array<string>;
	locale: string;
	others: any;
	createdBy: number;
	updatedBy: number;
	createdAt: Date;
	updatedAt: Date;
}
export default DocumentTemplateModel
