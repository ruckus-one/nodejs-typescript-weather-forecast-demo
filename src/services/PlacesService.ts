import cities from './cities'
import { injectable } from 'inversify';
import Places from '../interfaces/Places';

@injectable()
export default class PlacesService implements Places {
    public listCities(page?: number, limit?: number): object[] {
        if ((!page || page < 0) &&
            (!limit || limit < 1)) {
                return (cities as object[]).splice(0, 10)
        }

        return (cities as object[]).splice(page*limit, limit)
    }

    public search(query: string): object[] {
        return (cities as object[]).filter((city) => {
            return city['name'].indexOf(query) !== -1
        })
    }
}