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

  const tabOptions = [
    { value: "description", label: "Description" },
    { value: "about", label: "About the Author" },
    { value: "reviews", label: "Reviews" },
  ];

  const [tab, setTab] = useState(tabOptions[0].value);
  // const [quantity, setQuantity] = useState(1);

  const { productId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const data = await getBook(productId);

      if (!data) {
        setLoading(false);
        return;
      }

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
          key={name}
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
  };

  // const handleQuantityOnChange = (e) => {
  //   setQuantity(e.target.value);
  // };

  const handleCurrencyOnChange = (e) => {
    setCurrency(e.target.value);
  };

  const tabs = () => {
    const tabItems = tabOptions.map((item) => {
      return (
        <li
          key={item.value}
          className={`tabs__link ${
            tab === item.value ? "tabs__link--active" : ""
          }`}
        >
          <button onClick={() => handleTabChange(item.value)}>
            {item.label}
          </button>
        </li>
      );
    });
    return tabItems;
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
        <select className="product__currency" onChange={handleCurrencyOnChange}>
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
        </select>
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
          {/* <div className="product__buy">
            Qty.{" "}
            <input
              className="product__quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityOnChange}
            />{" "}
            <button className="product__add">Add to basket</button>
          </div> */}
          <div className="tabs">
            <ul className="tabs__links">{tabs()}</ul>
            {tab === "description" && (
              <div className="product__tab product__tab--description">
                <div
                  className="product__description"
                  dangerouslySetInnerHTML={{
                    __html: bookData.description,
                  }}
                ></div>
              </div>
            )}
            {tab === "about" && (
              <div className="product__tab product__tab--about">
                <div className="product__about">
                  <ul className="contributors">
                    {bookData.contributors?.map((contributor) => {
                      return (
                        <li className="contributors__item">
                          <img
                            className="contributors__image"
                            src={contributor.contributor.image}
                            alt={contributor.contributor.name}
                          />
                          <div className="contributor__content">
                            <h4 className="contributors__name">
                              {contributor.contributor.name}
                            </h4>
                            <div
                              className="contributors__bio"
                              dangerouslySetInnerHTML={{
                                __html: contributor.contributor.bio,
                              }}
                            ></div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
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
          <div className="product__retailers">
            <h3>Retailers</h3>
            {bookData.retailers?.map((retailer) => {
              return (
                <a
                  className="product__retailer"
                  key={retailer.seo}
                  href={retailer.path}
                  target="_blank"
                  rel="noreferrer"
                >
                  {retailer.label}
                </a>
              );
            })}
          </div>
          <div className="product__keywords">
            <h3>Keywords</h3>
            <ul className="keywords">
              {bookData.keywords?.split(";").map((keyword) => {
                const word = keyword.trim();
                return (
                  <li key={word} className="keywords__item">
                    {word}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
