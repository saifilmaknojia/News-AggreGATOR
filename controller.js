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
  console.log("Got the data now ", api_data);
  document.getElementById("result_container").innerHTML = JSON.stringify(
    api_data
  );
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

  // search_string.append("sources", [
  //   "washingtontimes.com",
  //   "standard.co.uk",
  //   "mirror.co.uk",
  //   "bbc.co.uk",
  // ]);

  // alert(search_string.toString());
  getData(search_string.toString());

  // for (i = 1; i <= 10; i++) {
  //   search_string.set("page", i);
  //   getData(search_string.toString());
  // }
}
