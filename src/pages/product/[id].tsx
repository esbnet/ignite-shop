import { useRouter } from 'next/router'
import { ImageContainer, ProductContainer, ProductDetails } from '../../../styles/pages/product'

export default function Product() {

  const { query } = useRouter()

  return (
    <ProductContainer>
      <ImageContainer>
      </ImageContainer>
      <ProductDetails>
        <h1>Camisa X</h1>
        <span>R$ 79,80</span>

        <p>Loren ipsum dolor sit amet, consectetur adipiscing elit. Null aenean lacinia,
          consectetur adipiscing elit. Null aenean lacinia</p>
        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  )
}