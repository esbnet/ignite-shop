import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from "next/image"

import { useKeenSlider } from 'keen-slider/react'

import 'keen-slider/keen-slider.min.css'
import { HomeContainer, Product } from "../styles/pages/home"

import { stripe } from '../lib/stripe'

import Link from 'next/link'
import Stripe from 'stripe'

interface HomeProps {
  products: {
    id: string,
    name: string,
    imagesUrl: string,
    price: string
  }[]
}

export default function Home({ products }: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">

        {products.map((product) => {
          return (
            <Link key={product.id} href={`/product/${product.id}`} prefetch={false}>
              <Product className="keen-slider__slide">
                <Image src={product.imagesUrl} width={520} height={480} alt='' />
                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          )
        })}
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await stripe.products.list(
    { expand: ['data.default_price'] }
  )

  const products = res.data.map(product => {
    const price = product.default_price as Stripe.Price

    if (Number(price.unit_amount) > 0) {
      price.unit_amount = Number(price.unit_amount) / 100
    } else {
      price.unit_amount = 0.00
    }

    return {
      id: product.id,
      name: product.name,
      imagesUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Number(price.unit_amount)),
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2 // 2 hours
  }
}
