import {getTodaysRssFileList} from '../Util/FoldeUtil.js'
import { parseFeed } from "https://deno.land/x/rss/mod.ts";
const process_list = [];
const failList = new Set();
const parseCacheRssFeed = async ()=>{
    const fileNames = await getTodaysRssFileList();
    console.log("Starting to concert all xml to json");
    fileNames.forEach(file=>processFile(file));
    const data=[];
    for(const file of fileNames ){
        const rssJson = await processFile(file);
        data.push(rssJson);
        
    }
    console.log("Final Json ready");
    return data;
}

const processFile = async (filelocation)=>{
    const text = await Deno.readTextFile(filelocation);
    
    let entries="";
    const data = {};
    try{
        const feed = await parseFeed(text);
        entries = feed.entries;
        data.author = feed.author||feed.description||feed.title?.value;
        data.copyright = feed.copyright;
        data.image = feed.image?.url;
        data.news=[];
    }catch(_e){
        console.log({filelocation})
        console.log(_e)
    }
    
    try{
        let i = 0;
        for(const y of entries){
            const arrays = data.news;
            const news = {};
            news["title"]=y["title"].value;
            news["pubDate"]=y["published"];
            news["link"]=y["links"][0].href;
            news["description"]=y["description"]?.value;
            data["news"] = [...arrays,news];
            i++;
          }
        
        failList.delete(filelocation);
        if(!process_list.includes(filelocation)){
            process_list.push(filelocation);
        }


        return data;
    }catch(e){
        if(!process_list.includes(filelocation)){
            failList.add(filelocation);
        }
        console.log(e)
        
    }
    return [];
    
    
}

export default parseCacheRssFeed;