import { QueryBuilder, Model, Page } from 'objection';
import GetForGridTable from './GetForGridTable'

class ExtendQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  ArrayQueryBuilderType!: ExtendQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: ExtendQueryBuilder<M, M>;
  NumberQueryBuilderType!: ExtendQueryBuilder<M, number>;
  PageQueryBuilderType!: ExtendQueryBuilder<M, Page<M>>;

  getForGridTable({ sorting = [], filters = [], pageSize = 50, page = 0, isSQL = false } = {}) {
    return GetForGridTable(this).exec({ sorting, filters, pageSize, page, isSQL })
  }
}
export default ExtendQueryBuilder
