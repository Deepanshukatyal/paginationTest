import axios from 'axios';


export const storyListApi = (page) => {
    return axios({
        method: "GET",
        url: 'https://hn.algolia.com/api/v1/search_by_date',
        params: {
            tags: 'story',
            page
        }
    })
}