import { GetStaticPaths, GetStaticProps } from "next"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import {
  ImageContainer,
  ProductContainer,
  ProductDetails
} from "../../styles/pages/product"

import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"

interface ProductProps {
  product: {
    id: string
    name: string
    imagesUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreateCheckoutSession, setIsCreateCheckoutSession] = useState(false)

  async function handleBuyProduct() {
    setIsCreateCheckoutSession(true)
    try {
      const response = await axios.post("/api/checkout", {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (error) {
      setIsCreateCheckoutSession(false)
      console.log(error)
      alert("Falha ao redirecionar ao chackout!")
    }
  }

  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Loading</p>
  } else {
    return (
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imagesUrl} width={520} height={480} alt='' />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>
          <p>{product.description}</p>
          <button disabled={isCreateCheckoutSession} onClick={handleBuyProduct}> Comprar agora </button>
        </ProductDetails>
      </ProductContainer>
    )
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "prod_MstCEm5COk1OlJ" } }],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const productId = params.id

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  })

  const price = product.default_price as Stripe.Price

  if (Number(price.unit_amount) > 0) {
    price.unit_amount = Number(price.unit_amount) / 100
  } else {
    price.unit_amount = 0.0
  }

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imagesUrl: product.images[0],
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(price.unit_amount)),
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}
