import { useKeenSlider } from 'keen-slider/react'
import { GetServerSideProps } from 'next'

import Image from "next/image"

import 'keen-slider/keen-slider.min.css'
import { HomeContainer, Product } from "../../styles/pages/home"

import { stripe } from '../lib/stripe'

import Stripe from 'stripe'


interface HomeProps {
  products: {
    id: string,
    name: string,
    imagesUrl: string,
    price: number
  }[]
}


export default function Home({ products }: HomeProps) {

  console.log(products)


  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">

      {products.map((product) => {
        return (
          <Product className="keen-slider__slide" key={product.id}>
            <Image src={product.imagesUrl} width={520} height={480} alt='' />
            <footer>
              <strong>{product.name}</strong>
              <span>R$ {product.price > 0 ? product.price / 100 : 0}</span>
            </footer>
          </Product>
        )
      })}

    </HomeContainer>
  )
}

export const getStaticProps: GetServerSideProps = async () => {
  const res = await stripe.products.list(
    { expand: ['data.default_price'] }
  )

  const products = res.data.map(product => {
    var price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imagesUrl: product.images[0],
      price: price.unit_amount,
    }
  })

  return {
    props: {
      products
    }
  }
}
