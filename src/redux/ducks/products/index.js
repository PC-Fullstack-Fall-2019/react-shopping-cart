import axios from "axios"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

// action definitions
const GET_PRODUCTS = "prodcuts/GET_PRODUCTS"
const FILTER_PRODUCTS = "products/FILTER_PRODUCTS"
const GET_SIZES = "products/GET_SIZES"

// initialState
const initialState = {
  products: [],
  display: [],
  sizes: []
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return { ...state, products: action.payload, display: action.payload }
    case FILTER_PRODUCTS:
      return {
        ...state,
        display: state.products.filter(p =>
          p.availableSizes.includes(action.filter)
        )
      }
    case GET_SIZES:
      return { ...state, sizes: action.payload }
    default:
      return state
  }
}

// action creators
const getProducts = () => {
  return dispatch => {
    axios.get("/api/products").then(resp => {
      dispatch({
        type: GET_PRODUCTS,
        payload: resp.data
      })
      dispatch(getSizes(resp.data))
    })
  }
}

const getSizes = products => {
  console.log("products", products)
  let arr = []

  products.forEach(p => {
    arr = arr.concat(p.availableSizes)
  })

  const unique = Array.from(new Set(arr))

  return {
    type: GET_SIZES,
    payload: unique
  }
}

const filterProducts = filter => {
  return {
    type: FILTER_PRODUCTS,
    filter: filter
  }
}

// custom hooks
export function useProducts() {
  const products = useSelector(appState => appState.productState.display)
  const sizes = useSelector(appState => appState.productState.sizes)
  const dispatch = useDispatch()
  const filter = filt => dispatch(filterProducts(filt))

  useEffect(() => {
    dispatch(getProducts())
  }, [])

  return { products, sizes, filter }
}
