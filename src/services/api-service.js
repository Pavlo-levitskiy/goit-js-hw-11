import axios from "axios";

const customAxios = axios.create({
  baseURL: "https://pixabay.com/api/",
  params: {
    key: "27487139-e524d10819fee38ea9f4aa544",
  },
});

export const fetchParams = {
  q: "",
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};


export const fetchGallery = (params) => {
  const res = customAxios.get('', { params })
  if (res.status > 200) {
    return Promise.reject(new Error(error));
  }
  return response.data;
};

