import React, { useState } from 'react';
import { client, urlFor } from '../../lib/client';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

/**
 * Method reponsible for displaying product details.
 * 
 * @param product - product which has to be displayed.
 * @param products - products which are suggested for the user. 
 * @returns HTML element.
 */
const ProductDetails = ({ product, products }) => {
    // Destructuring of the product object.
    const { image, name, details, price } = product;

    // Index of the displayed image.
    const [index, setIndex] = useState(0);

    // Fetching global variables from the StateContext.js.
    const { decQty, incQty, qty, onAdd } = useStateContext();

    return (
        <div>
            {/* 
                Product images.
            */}
            <div className="product-detail-container">
                <div>
                    <div className="image-container">
                        <img src={urlFor(image && image[index])} className="product-detail-image" />
                    </div>
                    <div className="small-images-container">
                        {image?.map((img, i) => (
                            <img
                                key={i}
                                src={urlFor(img)}
                                className={i === index ?
                                    "small-image selected-image" :
                                    "small-image"
                                }
                                onMouseEnter={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>

                {/* 
                    Product details (description, rating, price).
                */}
                <div className="product-detail-desc">
                    <h1>{name}</h1>

                    <div className="reviews">
                        <div>
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiOutlineStar />
                        </div>
                        <p>
                            (20)
                        </p>
                    </div>

                    <h4>Details: </h4>

                    <p>
                        {details}
                    </p>

                    <p className="price">${price}</p>

                    <div className="quantity">
                        <h3>Quantity:</h3>

                        <p className="quantity-desc">
                            <span
                                className="minus"
                                onClick={decQty}>
                                <AiOutlineMinus />
                            </span>

                            <span
                                className="num"
                            >
                                {qty}
                            </span>

                            <span
                                className="plus"
                                onClick={incQty}>
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>

                    <div className="buttons">
                        <button
                            type="button"
                            className="add-to-cart"
                            onClick={() => onAdd(product, qty)}
                        >
                            Add to cart
                        </button>

                        <button
                            type="button"
                            className="buy-now"
                            // TODO: add functionality to buy the product.
                            // onClick=""
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            
            {/*
                Slider with suggested products to buy. 
             */}
            <div className="maylike-products-wrappers">
                <h2>You may also like</h2>
                <div className="marquee">
                    <div className="maylike-products-container track">
                        {products.map((item) => (
                            <Product
                                key={item._id}
                                product={item}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Fetch products from the database to display them instantly if clicked.
export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
      slug {
        current
      }
    }
    `;

    const products = await client.fetch(query);

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }));

    return {
        paths,
        fallback: 'blocking'
    }
}

// Fetch products from the database.
export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]'

    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);

    return {
        props: { products, product }
    }
}

export default ProductDetails