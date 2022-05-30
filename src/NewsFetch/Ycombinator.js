

const getTopNews = async (rankingData) => {
    const topNews = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
        .then(response => response.json())
        .then(processData)

    return [...topNews,...rankingData];
}

const processData = async (dataArray) => {
    dataArray = dataArray.slice(0, 10);
    
    const dataPromises = dataArray.map(id => {
        const data = fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
            .then(response => response.json())
            .then(data => {
                if(data.type=="story"){
                    let dat = {};
                    dat.title = data.title;
                    dat.link = data.url;
                    return dat;
                }
            })
            return data;

    })
    let x = await Promise.all(dataPromises);
    return x;
}

export default getTopNews;