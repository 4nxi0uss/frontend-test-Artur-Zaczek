import React, { Component } from 'react';

import './CartOverlay.scss'
import { Link } from 'react-router-dom';

import cartImg from '../../../../img/cart-empty.svg'
import Modal from '../../../Modal/Modal';
import ProductRowOverlay from '../ProductRowOverlay/ProductRowOverlay';

import { connect } from 'react-redux';
import { changingCategory } from '../../headerSlice';
import { decrementQuantity, incrementQuantity, removeProduct } from '../../../ProductPage/productSlice';

import { apolloClient } from '../../../../Apollo/apolloClient';
import { gql } from '@apollo/client';

import { getTotalCost, getTotalQuantity } from '../../../../Utilities/Utilities';

class CartOverlay extends Component {
    state = {
        cartFlag: false,
        currencies: {}
    }

    componentDidMount() {
        apolloClient
            .query({
                query: gql`{ currencies{label symbol}}`, variables: { id: this.props.id }
            })
            .then((res) => (this.setState({ currencies: res.data.currencies })))
            .catch(err => console.warn(err))
    }

    componentDidUpdate(prevProps) {
        //closing cart overlay after changing category
        if (prevProps.category !== this.props.category) {
            this.setState({ cartFlag: false })
        }
    }

    render() {
        const { cartFlag, currencies } = this.state
        const { currencyIndex, productList } = this.props

        const prod = productList?.map(({ id, attributes, quantity }, index) => <ProductRowOverlay key={JSON.stringify(attributes)} id={id} choosenAttributes={attributes} quantity={quantity} index={index} />)

        return (
            <>
                <div className={`cart-icon`} onClick={() => { this.setState({ cartFlag: !cartFlag }) }}>
                    <img src={cartImg} alt="" className={`cart-icon__img`} />
                    {Boolean(getTotalQuantity(productList)) && <span className={`cart-icon__quantity-item`}>{getTotalQuantity(productList)}</span>}
                </div>

                <Modal isOpen={cartFlag} >
                    <p className={`bag-name`}>My bag, <span className={`bag-name__items`}>{getTotalQuantity(productList)} {getTotalQuantity(productList) === 1 ? `item` : `items`}</span></p>
                    {prod}
                    <div className={`cost`}><p className={`cost__total`}>Total</p> <p className={`cost__amount`}>{currencies?.[currencyIndex]?.symbol}{getTotalCost(productList, currencyIndex)}</p></div>
                    <div className={`btns`}>
                        <Link to={`/cart`} className={`btns__view`} onClick={() => { this.setState({ cartFlag: false }); this.setState({ redirectFlag: true }) }}>view bag</Link>
                        <button className={`btns__check`}>check out</button>
                    </div>
                </Modal>
            </>
        );
    }
}

const mapStateToPrps = (state) => ({
    currencyIndex: state.category.chosenCurrencies,
    category: state.category.category,
    productList: state.product.productList,
})

export default connect(mapStateToPrps, { changingCategory, incrementQuantity, decrementQuantity, removeProduct })(CartOverlay);