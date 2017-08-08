import { OhouhaOjClientPage } from './app.po';

describe('ohouha-oj-client App', () => {
  let page: OhouhaOjClientPage;

  beforeEach(() => {
    page = new OhouhaOjClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
