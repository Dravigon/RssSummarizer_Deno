

const getYCTopNews = async (rankingData) => {
    let topNewsData = [];
    for (let i = 1; i < 4; i++) {
        const data = await fetch(`https://api.thenewsapi.com/v1/news/top?api_token=1wMygBHRdgE7BRiaI7Ccf9Gwf9J1oxf0JMUTOOsM&categories=tech,science&locale=us,gb&page=${i}`).then(
            data => data.json()
        ).then(
            reponse => {
                const topNewsData = reponse.data;
                let transformedData = topNewsData.map(news => {
                    let dat = {};
                    dat.title = news.title;
                    dat.link = news.url;
                    dat.img_url = news.image_url;
                    dat.description = news.snippet;
                    return dat;
                });
                return transformedData;
            }
        );
        topNewsData  = [...topNewsData,...data];
    }
    const rankedData = [...topNewsData, ...rankingData];
    return rankedData;
}

export default getYCTopNews;