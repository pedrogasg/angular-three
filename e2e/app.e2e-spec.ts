import { NeoplasmePage } from './app.po';

describe('neoplasme App', function() {
  let page: NeoplasmePage;

  beforeEach(() => {
    page = new NeoplasmePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
