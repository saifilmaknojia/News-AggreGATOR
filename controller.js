var result_obj = {};

function getData(search_params) {
  var url = new URL("https://newscatcher.p.rapidapi.com/v1/search");
  url.search = search_params;

  fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "d12f10100bmsh46996f03b09b67fp121b1ejsnbd8566509c22",
      "x-rapidapi-host": "newscatcher.p.rapidapi.com",
    },
  })
    .then((response) => response.json())
    .then((json) => workWithData(json))
    .catch((err) => {
      console.error(err);
    });
}

function workWithData(api_data) {
  // console.log("Got the data now ", api_data);

  const articles = api_data.articles;
  const element = document.getElementById("result_container");
  // console.log(articles);
  const len = articles.length;

  for (var i = 0; i < len; i++) {
    var obj = articles[i];

    const title = obj["title"];
    const author = obj["author"];
    const summary = obj["summary"];
    const published_date = obj["published_date"];
    const article_link = obj["link"];
    const article_media =
      "media" in obj && obj["media"] != null
        ? obj["media"]
        : "./assets/no-thumbnail.jpg";

    let form_html_component = `<div class="post_container mb-3"> <div class="row">  
    <div class="col-3 mb-3 mt-3"> 
    <img src = ${article_media} class="mt-3 ms-3 article_media"  alt="article_media" /> </div>
    <div class="col-9 mb-3 mt-3"> 
    <h3 class="title"> ${title} </h3> 
    <i><b><u> By ${author} published on ${published_date} </u></b></i>
    <p class="summary mt-2"> ${summary} </p>
    <a href="${article_link}" target="_blank"
                  >Continued Here » ${article_link}</a>
    </div></div></div> `;
    //   "<div class='post_container'>" + title + "  </div>";
    element.insertAdjacentHTML("afterend", form_html_component);
  }
}

function formSearchString() {
  // alert("clicked");
  let search_string = new URLSearchParams();

  let query_string = document.getElementById("search").value;
  query_string = query_string.trim();
  if (query_string == "") {
    alert("Empty query string not allowed");
    return;
  } else {
    search_string.append("q", query_string);
  }

  const sort_by_element = document.getElementById("sort_by");
  const sort_by_option =
    sort_by_element.options[sort_by_element.selectedIndex].value;

  search_string.append("sort_by", sort_by_option);

  const topic_element = document.getElementById("topic");
  const topic_option = topic_element.options[topic_element.selectedIndex].value;

  if (topic_option != "all") search_string.append("topic", topic_option);

  const last_days_element = document.getElementById("last_n_days");
  const last_days_option =
    last_days_element.options[last_days_element.selectedIndex].value;

  if (last_days_option != "empty") {
    let curr_date = new Date();
    curr_date.setDate(curr_date.getDate() - parseInt(last_days_option));

    search_string.append("from", curr_date);
  }

  search_string.append("media", "True");
  search_string.append("ranked_only", "True");
  search_string.append("lang", "en");

  // search_string.append("sources", [
  //   "washingtontimes.com",
  //   "standard.co.uk",
  //   "mirror.co.uk",
  //   "bbc.co.uk",
  // ]);

  // alert(search_string.toString());
  for (i = 1; i <= 5; i++) {
    search_string.set("page", i);
    getData(search_string.toString());
  }
}
