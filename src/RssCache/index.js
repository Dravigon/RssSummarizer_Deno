import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { writableStreamFromWriter } from "https://deno.land/std@0.134.0/streams/mod.ts";
import { getTodaysFolderName } from '../Util/FoldeUtil.js'


const cacheRssList = async (list) => {
  console.log("starting caching of all rss feeds");
  for (const value of list) {
    await CacheRss(value);
  }
  console.log("Cached of all rss feeds");
  return true;

}

const CacheRss = async (url) => {
  try {
    const data = await fetch(url);

    const mydatestr = getTodaysFolderName();

    const pathFound = existsSync(mydatestr)
    if (!pathFound) {
      await Deno.mkdir(mydatestr, { recursive: true });
    }

    if (data.ok && data.status == 200) {
      const filename = `${mydatestr}/` + encodeURIComponent(data.url);
      try {
        const file = await Deno.create(filename, { write: true, create: true });
        const writableStream = writableStreamFromWriter(file);
        await data.body.pipeTo(writableStream);
      } catch (_e) {
        console.log(data.url)

      }
    }
  } catch (e) {
    console.log(e);
  }
};

export default cacheRssList;


