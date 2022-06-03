const axios = require("axios");
const { config } = require("./config.js");

var finalJsonResult = [];

async function getData(search_params, next_page) {
  const options = {
    method: "GET",
    url: "https://newscatcher.p.rapidapi.com/v1/search",
    params: search_params,
    headers: {
      "X-RapidAPI-Host": "newscatcher.p.rapidapi.com",
      "X-RapidAPI-Key": "d12f10100bmsh46996f03b09b67fp121b1ejsnbd8566509c22",
    },
  };

  await axios
    .request(options)
    .then((response) => {
      return parseResponse(response.data);
    })
    .then((articles) => {
      //  console.log(articles);
      for (var i = 0; i < articles.length; i++) {
        // clean the data and form the article to push it on the stack
        var obj = articles[i];

        const cleaned_article_media =
          "media" in obj && obj["media"] != null
            ? obj["media"]
            : "../images/no-thumbnail.jpg";

        var cleaned_article = {
          title: obj["title"],
          author: obj["author"],
          summary: obj["summary"],
          published_date: obj["published_date"],
          article_link: obj["link"],
          article_media: cleaned_article_media,
          score: obj["_score"],
        };
        //  console.log(cleaned_article);
        finalJsonResult.push(cleaned_article);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

async function parseResponse(api_data) {
  if (
    "message" in api_data &&
    api_data.message ==
      "You have exceeded the rate limit per hour for your plan, BASIC, by the API provider"
  ) {
    console.log(
      "Apologies! The API limit for free basic plan is exceeded, try again after 1 hour, Thank you!"
    );
    throw new Error(
      "You have exceeded the rate limit per hour for your plan, BASIC, by the API provider"
    );
  }
  const articles = api_data.articles;

  return articles;
}

async function formSearchString(body) {
  // reset the finalResultJson array so that new requests don't get the older results
  finalJsonResult = [];

  const search_string = new URLSearchParams();
  let query_string = body.search;
  query_string = query_string.trim();
  if (query_string == "") {
    alert("Empty query string not allowed");
    return;
  } else {
    search_string.append("q", query_string);
  }

  const sort_by_element = body.sort_by;
  const sort_by_option = sort_by_element;

  search_string.append("sort_by", sort_by_option);

  const topic_element = body.topic;
  const topic_option = topic_element;

  if (topic_option != "all") search_string.append("topic", topic_option);

  const last_days_element = body.last_n_days;
  const last_days_option = last_days_element;

  if (last_days_option != "empty") {
    let curr_date = new Date();
    curr_date.setDate(curr_date.getDate() - parseInt(last_days_option));

    search_string.append("from", curr_date);
  }

  search_string.append("media", "True");
  search_string.append("ranked_only", "True");
  search_string.append("lang", "en");

  await fetchResults(search_string);

  return finalJsonResult;
}

async function fetchResults(search) {
  // each page will have 5 articles, so 5 * 5 = 25 articles
  for (let page_number = 1; page_number <= 4; page_number++) {
    search.set("page", page_number);
    await getData(search, page_number);
  }
}

module.exports = {
  fetchResults,
  parseResponse,
  getData,
  formSearchString,
};
