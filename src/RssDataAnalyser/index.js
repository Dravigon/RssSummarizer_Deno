
import { sanitize, restore } from 'https://deno.land/x/zenjson/mod.ts';

const analyseData = async (json) => {
    let rankingData = [];
    let i =0;
    const datum = JSON.parse(json);
    for (let data of datum) {
        if (data.news) {
            console.log("remaining .... "+(datum.length-i))
            i++
            let newsList = data.news.map((newsdata) => { return { link: newsdata.link, summary: newsdata.description ,title:newsdata.title|| " " } });
            let sentimentData = await sentimentAnalyse(newsList);
            if (sentimentData) {
                sentimentData = sanitize(sentimentData);
                let sentimentJSON = JSON.parse(sentimentData);
                sentimentJSON = sentimentJSON.map(elem => { elem = JSON.parse(elem);return { ...elem, image: data.image, author: data.author } })
                rankingData = [...rankingData, ...sentimentJSON]
            }

        }
    }
    rankingData.sort((a, b) => b.subjectivity - a.subjectivity);
    rankingData = rankingData.slice(0, 100);
    let positiveData = [...rankingData];
    let negativeData = [...rankingData];

    positiveData.sort((a, b) => b.polarity - a.polarity);
    negativeData.sort((a, b) => a.polarity - b.polarity);
    positiveData = positiveData.slice(0, 5);
    negativeData = negativeData.slice(0, 5);

    rankingData = [...negativeData, ...positiveData];

    Deno.removeSync("temp.py");

    return rankingData;
}


async function sentimentAnalyse(data) {

    // console.log(data)
    data = JSON.stringify(data);

    const pythonScript = `

import nltk
import unicodedata
nltk.download('punkt')

import json
from newspaper import Article
from textblob import TextBlob
sentiments = []
jsondata = ${data}


for data in jsondata:
    article = Article(data['link'])
    article.download()
    article.parse()
    article.nlp()
    analysis = TextBlob(article.text)
    sentiment = {}
    sentiment['link'] = data['link']
    sentiment['title'] = data['title']
    desc = unicodedata.normalize("NFKD", data['summary'])
    desc = desc.replace("'", "’") 
    sentiment['description'] = desc
    sentiment['polarity'] = analysis.polarity
    sentiment['subjectivity'] = analysis.subjectivity
    
    sentiments.append(json.dumps(sentiment))
print(json.dumps(sentiments))
    `;
    await Deno.writeTextFile("temp.py", pythonScript);
    const cmd = Deno.run({
        cmd: ["python3", "temp.py"],
        stdout: "piped",
        stderr: "piped"
    });

    const output = await cmd.output() // "piped" must be set
    const outStr = new TextDecoder().decode(output);

    const error = await cmd.stderrOutput();
    const errorStr = new TextDecoder().decode(error);

    cmd.close(); // Don't forget to close it

    // console.log(outStr)
    console.log(errorStr)
    return outStr;
    ;
}


export default analyseData;