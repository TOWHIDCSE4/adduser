import { Model } from 'objection';
import Database from '@core/Databases'

Model.knex(Database.connection);

export default Model
