import Image from "next/image"

import { styled } from "../../styles"
import { HomeContainer, Product } from "../../styles/pages/home"

import camisa1 from "../assets/shirt1.png"
import camisa2 from "../assets/shirt2.png"
import camisa3 from "../assets/shirt3.png"
import camisa4 from "../assets/shirt4.png"

const Button = styled("button", {
  background: "$gree300",
  borderRadius: 4,
  border: 0,
  padding: "4px 8px",

  span: {
    fontWeight: "bold",
  },

  "&:hover": {
    filter: "brightness(0.8)",
  },
})

export default function Home() {
  return (
    <HomeContainer>
      <Product>
        <Image src={camisa1} width={520} height={480} alt='' />
        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>
      <Product>
        <Image src={camisa2} width={520} height={480} alt='' />
        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>
      <Product>
        <Image src={camisa3} width={520} height={480} alt='' />
        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>
    </HomeContainer>
  )
}
