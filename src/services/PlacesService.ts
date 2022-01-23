import cities from './cities'
import { injectable } from 'inversify';
import Places from '../interfaces/Places';

@injectable()
export default class PlacesService implements Places {
    public listCities(page?: number, limit?: number): object[] {
        if ((page === undefined || page < 0) &&
            (limit === undefined || limit < 1)) {
                return (cities as Array<object>).splice(0, 10)
        }

        return (cities as Array<object>).splice(page*limit, limit)
    }

    public search(query: string): object[] {
        return (cities as Array<object>).filter((city) => {
            return city['name'].indexOf(query) !== -1
        })
    }
}