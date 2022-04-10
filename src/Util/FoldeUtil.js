
const FOLDER_LOCATION = Deno.env.get("RSS_BATCH_FOLDER_LOCATION");

function getTodaysFolderName() {
    const mydate = new Date();
    const curr_date = mydate.getDate();
    const curr_month = mydate.getMonth();
    const curr_year = mydate.getFullYear();
    const mydatestr = "rss_feed_" + curr_year + "_" +
        curr_month + "_" +
        curr_date + "";
    return FOLDER_LOCATION||"." + "/" +mydatestr;
}
const getTodaysRssFileList= async ()=> {
    const todaysFolder = getTodaysFolderName();

    const fileNames = [];
	
    for await (const dirEntry of Deno.readDir(todaysFolder)) {
      
      if (dirEntry.isFile) {
      
        fileNames.push(todaysFolder+"/"+dirEntry.name);
      
      }
      
    }

    return fileNames;
}

function writeTodaysJson( data) {
  try {
    Deno.writeTextFileSync(getTodaysFolderName()+".json", JSON.stringify(data));

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}
export {getTodaysFolderName,getTodaysRssFileList,writeTodaysJson} ;