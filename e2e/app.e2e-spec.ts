import { IcoCoinMonitorPage } from './app.po';

describe('ico-coin-monitor App', () => {
  let page: IcoCoinMonitorPage;

  beforeEach(() => {
    page = new IcoCoinMonitorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
