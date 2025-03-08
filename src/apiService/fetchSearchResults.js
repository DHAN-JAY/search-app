
const API_URL = "https://jsonplaceholder.typicode.com/comments?q=";

export function fetchSearchResults(searchTerm) {

    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${API_URL}${searchTerm}`, true);
    
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              resolve(data.slice(0, 20)); // Limit to 20 results
            //   resolve([{ id: 1, name: "John Doe", email: "john@example.com", body: "Sample comment text here..." }])
            } else {
            //   resolve([{ id: 1, name: "John Doe", email: "john@example.com", body: "Sample comment text here..." }]);
              resolve([]);
              console.error("Error fetching data:", xhr.statusText);
            }
          }
        };
    
        xhr.send();
    })
}