export const getBook = async (isbn13) => {
  const data = await getData(isbn13);

  if (!data) {
    return;
  }

  const book = {
    ...data,
    largeImage: getLargeImageUrl(data.image),
  };

  return book;
};

const getData = async (isbn13) => {
  const url = `${process.env.REACT_APP_API_BASE}/dev/products/${isbn13}.json`;

  try {
    const response = await fetch(url, {
      mode: "cors",
    });

    if (!response.ok) throw Error;

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
  return;
};

const getLargeImageUrl = (url) => {
  const largeUrl = url.replace("/x145", "/x400");
  return largeUrl;
};
