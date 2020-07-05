import assign from 'object-assign'
import {EventEmitter} from 'events';

const RSSFeedService = assign({}, EventEmitter.prototype, {
    result: {},

    isValidURL(url) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(url);
      },
      
      async fetchListOfRssFeeds(rssFeedUrl) {
        let url = "https://api.rss2json.com/v1/api.json?rss_url="+rssFeedUrl+"?format=xml";
        const response =  await fetch(url)
        this.result = await response.json();
        return this.result;
      },
	emitChange () {
		this.emit('change')
	}
})

export default RSSFeedService