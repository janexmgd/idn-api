import axios from 'axios';

export const getIdnLive = async (category) => {
  try {
    const { data } = await axios.get('https://api.idn.app/api/v4/livestreams', {
      params: {
        category: category,
        page: '1',
      },
      headers: {
        'User-Agent': 'Android/13/Redmi Note 8/6.51.0',
        'x-api-key': '123f4c4e-6ce1-404d-8786-d17e46d65b5c',
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
