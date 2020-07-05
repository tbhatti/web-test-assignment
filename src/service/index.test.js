
import Service from './index';


it('RSS feeds items should be 10', async () => {
  expect.assertions(1);
  const data = await Service.fetchListOfRssFeeds("https://hnrss.org/newest");
  expect(data['items'].length).toBe(10);
});
