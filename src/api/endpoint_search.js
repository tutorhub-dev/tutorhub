class SearchEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    search = (req, res) => {
        res.status(501).send('Not Implemented')
    }
}

module.exports = SearchEndpoints;