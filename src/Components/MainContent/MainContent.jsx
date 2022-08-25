import React, { Component } from 'react';

import './MainContent.scss'

import CategoryPage from '../CategoryPage/CategoryPage';
import { Route, Routes } from 'react-router-dom';
import ProductPage from '../ProductPage/ProductPage';

class MainContent extends Component {

    render() {
        return (<main className='main-content'>
            <Routes>
                <Route path='/' element={<CategoryPage />} />
                <Route path='/product-page' element={<ProductPage />} />
            </Routes>
        </main>);
    }
}

export default MainContent;