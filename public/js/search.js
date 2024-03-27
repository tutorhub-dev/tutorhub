// on page load
let searchPanel;
document.addEventListener("DOMContentLoaded", function() {
    // create the search panel
    searchPanel = new SearchPanel("search-entries");
    searchPanel.render();

    // add search button event listener
    document.getElementById("search-button").addEventListener("click", function(e) {
        e.preventDefault();
        searchPanel.search();
    });

    // add form change event listener
    searchPanel.validate();
    document.getElementById("searchForm").addEventListener("change", function() {
        searchPanel.validate();
    });
});
