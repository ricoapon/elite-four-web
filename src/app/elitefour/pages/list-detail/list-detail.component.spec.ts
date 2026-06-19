import {ListDetailComponent} from './list-detail.component';
import {FavoriteItem} from '../../backend/favorite-list-interfaces';

describe('ListDetailComponent', () => {
  let component: ListDetailComponent;

  beforeEach(() => {
    component = new ListDetailComponent(
      undefined as any,
      undefined as any,
      undefined as any,
      undefined as any,
      undefined as any,
      undefined as any,
    );
  });

  it('filters items by visible search text', () => {
    component.searchItemName = 'radio';

    const result = component.sortAndFilter([
      item('Radiohead - Weird Fishes'),
      item('The National - Bloodbuzz Ohio')
    ]);

    expect(result.map((favoriteItem) => favoriteItem.name)).toEqual(['Radiohead - Weird Fishes']);
  });

  it('filters items case-insensitively', () => {
    component.searchItemName = 'RADIO';

    const result = component.sortAndFilter([
      item('Radiohead - Weird Fishes'),
      item('The National - Bloodbuzz Ohio')
    ]);

    expect(result.map((favoriteItem) => favoriteItem.name)).toEqual(['Radiohead - Weird Fishes']);
  });

  function item(name: string): FavoriteItem {
    return {
      id: name.length,
      name,
      eliminatedBy: [],
      toBeChosen: false
    };
  }
});
