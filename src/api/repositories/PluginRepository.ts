import { EntityRepository, Repository } from 'typeorm';
import { Plugins } from '../../plugin-manager/models/Plugin';

@EntityRepository(Plugins)
export class PluginRepository extends Repository<Plugins>  {

}
