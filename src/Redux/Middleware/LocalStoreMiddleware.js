export const localSotrageMiddleware = (store) => (next) => ({ type, payload }) => {

    const result = next({ type, payload });

    if (type.startsWith('product')) {
        localStorage.setItem('products', JSON.stringify(store.getState().product.productList))
    }

    if (type === ('header/changingCurrencies')) {
        localStorage.setItem('currencieIndex', JSON.stringify(store.getState().category.chosenCurrencies))
    }

    return result;
}
