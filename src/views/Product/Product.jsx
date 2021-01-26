import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Error from "../Error/Error";

import { getBook } from "../../utils/api";

import "./Product.scss";

const Product = () => {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [tab, setTab] = useState("about");

  const { productId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const data = await getBook(productId);

      setBookData(data);
      setPrices(data.formats[0].prices);
      setLoading(false);
    };
    getData();
  }, [productId, setBookData]);

  if (loading) {
    return <div className="loading">Loading ...</div>;
  }

  if (!bookData) {
    return <Error />;
  }

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  const getContributors = () => {
    return bookData.contributors.map((item) => {
      const name = item.contributor.name;
      const roleString = item.role.name;
      const contributorString = roleString.replace(
        "(author)",
        `<span class="contributor__name">${name}</span>`
      );
      return (
        <li
          className="contributor"
          dangerouslySetInnerHTML={{
            __html: contributorString,
          }}
        ></li>
      );
    });
  };

  const getSaleDate = () => {
    const date = new Date(bookData.sale_date.date);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    const format = bookData.formats.find((item) => item.id === value);
    format.prices.length ? setPrices(format.prices) : setPrices(null);
    console.log(value);
  };

  return (
    <div className="product container">
      <div className="breadcrumbs">
        <ul className="breadcrumbs__list">
          <li className="breadcrumbs__item">
            <Link to={`/`}>Home</Link>
          </li>
          <li className="breadcrumbs__item">
            <Link to={`/products/`}>Products</Link>
          </li>
          <li className="breadcrumbs__item breadcrumbs__item--active">
            {bookData.title}
          </li>
        </ul>
      </div>
      <section className="product__row">
        <div className="product__gallery">
          <img src={bookData.largeImage} alt={bookData.title} />
        </div>
        <div className="product__content">
          <h1 className="product__title">{bookData.title}</h1>
          {bookData.contributors.length && (
            <ul className="product__contributors">{getContributors()}</ul>
          )}
          <div className="product__sale">
            <span>On Sale: </span>
            {getSaleDate()}
          </div>
          <div className="product__price">
            {prices && prices.length
              ? prices?.find((item) => item.locale === currency).amount +
                " " +
                currency
              : "FREE"}
          </div>
          <select className="product__options" onChange={handleSelectChange}>
            {bookData.formats.map((format) => {
              return (
                <option key={format.id} value={format.id}>
                  {format.detail}
                </option>
              );
            })}
          </select>
          <div className="tabs">
            <ul className="tabs__links">
              <li
                className={`tabs__link ${
                  tab === "about" ? "tabs__link--active" : ""
                }`}
              >
                <button onClick={() => handleTabChange("about")}>About</button>
              </li>
              <li
                className={`tabs__link ${
                  tab === "details" ? "tabs__link--active" : ""
                }`}
              >
                <button onClick={() => handleTabChange("details")}>
                  Product Details
                </button>
              </li>
              <li
                className={`tabs__link ${
                  tab === "reviews" ? "tabs__link--active" : ""
                }`}
              >
                <button onClick={() => handleTabChange("reviews")}>
                  Reviews
                </button>
              </li>
            </ul>
            {tab === "about" && (
              <div className="product__tab product__tab--about">
                <div
                  className="product__description"
                  dangerouslySetInnerHTML={{
                    __html: bookData.description,
                  }}
                ></div>
              </div>
            )}
            {tab === "details" && (
              <div className="product__tab product__tab--details">
                <div className="product__details"></div>
              </div>
            )}
            {tab === "reviews" && (
              <div className="product__tab product__tab--reviews">
                <div className="product__reviews">
                  {bookData.reviews?.map((item) => {
                    return (
                      <div key={item.id} className="review">
                        <div
                          className="review__content"
                          dangerouslySetInnerHTML={{
                            __html: item.review.description,
                          }}
                        ></div>
                        <div
                          className="review__author"
                          dangerouslySetInnerHTML={{
                            __html: item.review.reviewer,
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
