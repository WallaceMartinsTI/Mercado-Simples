import { useState, useEffect, SyntheticEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'

import './App.css'

interface ProductProps {
  id: string;
  name: string;
  price: string | number;
  quantity: string | number;
  total: number;
}

function App() {
  const [initialProduct] = useState(localStorage.getItem("products"))
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [products, setProducts] = useState((initialProduct === null ? [{ id: "0", name, price, quantity, total: (Number(quantity) * Number(price)) }] : JSON.parse(initialProduct)))

  const totalCost = products.reduce((total: number, product: ProductProps) => {
    return total + product.total
  }, 0)

  const clearForm = () => {
    setName("")
    setPrice("")
    setQuantity("")
  }

  const removeProduct = (id: string) => {
    const newProducts = products.filter((product: ProductProps) => {
      return product.id !== id
    })
    if (newProducts.length === 0) {
      setProducts([{ id: "0", name, price, quantity, total: (Number(quantity) * Number(price)) }])
    } else {
      setProducts(newProducts)
    }
  }

  const removeAllProducts = () => {
    localStorage.removeItem("products")
    window.location.reload()
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (products[0].id === "0") {
      setProducts([{
        id: uuidv4(),
        name,
        price,
        quantity,
        total: (Number(quantity) * Number(price))
      }])
    } else {
      setProducts([...products, {
        id: uuidv4(),
        name,
        price,
        quantity,
        total: (Number(quantity) * Number(price))
      }])
    }
    clearForm()
  }

  const [showValue, setShowValue] = useState(false)

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
    if (products[0].id !== "0") {
      setShowValue(true)
    } else {
      setShowValue(false)
    }
  }, [products])

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>Mercado Simples</h1>
          <p>O valor de sua compra em tempo real</p>
        </header>

        <div id="display" className="display">
          <div>Total</div>
          <div>{(totalCost).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>
        </div>

        <div className="line1"></div>

        <form onSubmit={handleSubmit} className="addProduct">
          <p>Cadastrar Produto</p>

          <div className="productName">
            <input
              type="text"
              onInvalid={e => (e.target as HTMLInputElement).setCustomValidity("Insira um nome válido")}
              onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
              placeholder='Digite o nome do produto'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="priceAndQuantity">
            <input
              id="quantity"
              type="number"
              onInvalid={e => (e.target as HTMLInputElement).setCustomValidity("Quantidade Inválida (1 -30)")}
              onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
              min="1"
              max="30"
              placeholder='Quantidade'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <input
              id="price"
              type="number"
              onInvalid={e => (e.target as HTMLInputElement).setCustomValidity("Preço Inválido (0.01 - 5000)")}
              onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
              min="0"
              max="5000"
              step=".01"
              placeholder='Preço'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="addProductButtons">
            <button id="clear" type="button" onClick={clearForm}>Limpar</button>
            <button id="add" type="submit">Cadastrar</button>
          </div>
        </form>

        <div className="line2"></div>

        <main>
          <h2>Produtos</h2>
          {showValue &&
            <div>
              {products.map((product: ProductProps) => (
                <div key={product.id} className="productsList">
                  <div className="nameAndButton">
                    <div className='gridItemName'>
                      <p>{product.name}</p>
                    </div>

                    <button onClick={() => removeProduct(product.id)} className='removeProduct'>
                      <p>Remover</p>
                    </button>
                  </div>

                  <div className="qntPriceTotal">
                    <div className='quantity'>
                      <p>{product.quantity}</p>
                    </div>

                    <div className="money">
                      <p>
                        {(Number(product.price)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>

                    <div className="money">
                      <p>
                        {(Number(product.quantity) * Number(product.price)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </main>

        <div className="footer">
          <button onClick={removeAllProducts}>
            Limpar todos os produtos
          </button>
        </div>
      </div>

      <footer>
        <a href="https://www.linkedin.com/in/wallace-martins-ti/" target="_blank">
          <p>WCSM &copy; 2022</p>
        </a>
      </footer>
    </div>
  )
}

export default App
