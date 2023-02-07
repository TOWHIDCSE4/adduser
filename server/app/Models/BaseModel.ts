import Base from '@core/Databases/BaseModel';
import ExtendQueryBuilder from './QueryBuilder';

class BaseModel extends Base {
  //static QueryBuilder: typeof ExtendQueryBuilder = ExtendQueryBuilder
  QueryBuilderType!: ExtendQueryBuilder<this>;
  static QueryBuilder = ExtendQueryBuilder;


  static async getById<T extends BaseModel>(this: new() => T, id, project = '*'): Promise<T> {
    return await (this as any).query().findOne({ id: id }).select(project);
  }
  static async getAll<T extends BaseModel>(this: new() => T, project = '*'): Promise<T[]> {
    return await (this as any).query().select(project);
  }
  static async getOne<T extends BaseModel>(this: new() => T, condition, project = '*'): Promise<T> {
    return await (this as any).query().findOne(condition).select(project);
  }
  static async getByCondition<T extends BaseModel>(this: new() => T, condition, project = '*'): Promise<T[]> {
    return await (this as any).query().where(condition).select(project);
  }
  static async insertOne<T extends BaseModel>(this: new() => T, object): Promise<T> {
    return await (this as any).query().insert(object);
  }
  static async insertMany<T extends BaseModel>(this: new() => T, array): Promise<T[]> {
    return await (this as any).query().insertGraph(array, { allowRefs: true });
  }
  static async updateOne<T extends BaseModel>(this: new() => T, id, fields): Promise<T> {
    return await (this as any).query().update(fields).where({ id: id });
  }
  static async updateByCondition<T extends BaseModel>(this: new() => T, condition, params = {}): Promise<T> {
    return await (this as any).query().update(params).where(condition);
  }
  static async deleteById<T extends BaseModel>(this: new() => T, id): Promise<T> {
    return await (this as any).query().del().where({ id: id });
  }
  static async deleteByIds<T extends BaseModel>(this: new() => T, ids = []): Promise<T[]> {
    return await (this as any).query().del().findByIds(ids);
  }
  static async deleteByCondition<T extends BaseModel>(this: new() => T, condition): Promise<T[]> {
    return await (this as any).query().del().findOne(condition);
  }
  static async findExist<T extends BaseModel>(this: new() => T, value, column): Promise<T> {
    return await (this as any).query().whereRaw(`LOWER(${column}) = ?`, value.toLowerCase()).first();
  }
}

export default BaseModel
