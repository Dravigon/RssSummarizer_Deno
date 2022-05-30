import rssList  from '../FeedList.json' assert { type: "json" };
import cacheRssList from './RssCache/index.js';
import analyseData from './RssDataAnalyser/index.js';
import parseCachedRss from './RssParser/index.js'
import {writeTodaysJson} from './Util/FoldeUtil.js'

import AddTopNews from './NewsFetch/TopNews.js'
import getYCTopNews from './NewsFetch/Ycombinator.js'


const x= await cacheRssList(rssList);

let newsData = [];
if(x)
newsData = await parseCachedRss();

let stringNewsData =  JSON.stringify(newsData) ;

let rankingData = await analyseData(stringNewsData);

rankingData = await getYCTopNews(rankingData);

rankingData = await AddTopNews(rankingData);



rankingData = shuffle(rankingData);

const ranked_data = {newsData,rankingData}

/// console.log(ranked_data)


writeTodaysJson(ranked_data);



function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}

