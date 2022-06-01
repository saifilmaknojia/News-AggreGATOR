const fetch = require("node-fetch");
const { config } = require("./config.js");

var finalJsonResult = [];

async function getData(search_params, next_page) {
  var url = new URL("https://newscatcher.p.rapidapi.com/v1/search");
  url.search = search_params.toString();
  await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": config.apiKey,
      "x-rapidapi-host": "newscatcher.p.rapidapi.com",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return workWithData(json, search_params, next_page);
    })
    .then((articles) => {
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

        finalJsonResult.push(cleaned_article);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

async function workWithData(api_data, search_paramas, next_page) {
  // console.log("Got the data ", api_data);
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
  //  const element = document.getElementById("result_container");
  return articles;
  //   const len = articles.length;

  //   for (var i = 0; i < len; i++) {
  //     var obj = articles[i];

  //     const title = obj["title"];
  //     const author = obj["author"];
  //     const summary = obj["summary"];
  //     const published_date = obj["published_date"];
  //     const article_link = obj["link"];
  //     const article_media =
  //       "media" in obj && obj["media"] != null
  //         ? obj["media"]
  //         : "../images/no-thumbnail.jpg";

  let form_html_component = `<div class="post_container mb-3"> <div class="row">
        <div class="col-3 align-self-center text-center">
        <img src = ${article_media} class="ms-3 article_media"  alt="article_media" /> </div>
        <div class="col-9 mb-3 mt-3">
        <h3 class="title"> ${title} </h3>
        <i><b><u> Published By - ${author} <br> On - ${published_date} <br> Score - ${obj["_score"]} </u></b></i>
        <p class="summary mt-2"> ${summary} </p>
        <a href="${article_link}" target="_blank"
                      >Continued Here » ${article_link}</a>
        </div></div></div> `;
  //   "<div class='post_container'>" + title + "  </div>";
  //  element.insertAdjacentHTML("beforeend", form_html_component);

  //     console.log(form_html_component);
  // }
}

async function formSearchString(body) {
  // alert("clicked");
  // document.getElementById("result_container").innerHTML = "";
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

  // callbackFetchNextPage(search_string, 1);

  await fetchResults(search_string);

  // console.log("final result --> ", finalJsonResult);

  return finalJsonResult;
}

async function fetchResults(search) {
  for (let page_number = 1; page_number <= 2; page_number++) {
    search.set("page", page_number);
    await getData(search, page_number);
    // console.log(finalJsonResult);
  }
}

module.exports = {
  fetchResults,
  workWithData,
  getData,
  formSearchString,
};
