import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://pixabay.com/api/",
  params: {
    key: "27487139-e524d10819fee38ea9f4aa544",
  },
});

export const getImgParams = {
  q: "",
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};

export async function fetchGallery(params){
 const res = customFetch.get('', { params })
  if ((await res).status > 200) {
  return Promise.reject(e)
  }
  return (await res).data;
}
