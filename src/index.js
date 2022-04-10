import rssList  from '../FeedList.json' assert { type: "json" };
import cacheRssList from './RssCache/index.js';
import parseCachedRss from './RssParser/index.js'
import {writeTodaysJson} from './Util/FoldeUtil.js'



const x= await cacheRssList(rssList);

let final_json = [];
if(x)
final_json = await parseCachedRss();

writeTodaysJson(final_json);


