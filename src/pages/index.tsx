// Hooks
import { useState, useEffect, SyntheticEvent } from "react";

// Modules
import { v4 as uuidv4 } from "uuid";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { GetServerSideProps } from "next";

// CSS
import styles from "./styles.module.scss";

interface ProductProps {
  id: string;
  name: string;
  price: string | number;
  quantity: string | number;
  total: number;
}

interface HomeProps {
  serverProducts: ProductProps[];
}

export default function Home({ serverProducts }: HomeProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState(serverProducts);

  const totalCost = products!.reduce((total: number, product: ProductProps) => {
    return total + product.total;
  }, 0);

  const clearForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
  };

  const removeProduct = (id: string) => {
    const newProducts = products!.filter((product: ProductProps) => {
      return product.id !== id;
    });
    if (newProducts.length === 0) {
      setProducts([
        {
          id: "0",
          name,
          price,
          quantity,
          total: Number(quantity) * Number(price),
        },
      ]);
    } else {
      setProducts(newProducts);
    }
  };

  const removeAllProducts = () => {
    destroyCookie(null, "products");
    const initalCookie = [{ id: 0, name: "", price: 0, quantity: 0, total: 0 }];
    setCookie(null, "products", JSON.stringify(initalCookie), {
      maxAge: 86400 * 28,
      path: "/",
    });

    window.location.reload();
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (products![0].id == "0") {
      setProducts([
        {
          id: uuidv4(),
          name,
          price,
          quantity,
          total: Number(quantity) * Number(price),
        },
      ]);
    } else {
      setProducts([
        ...products!,
        {
          id: uuidv4(),
          name,
          price,
          quantity,
          total: Number(quantity) * Number(price),
        },
      ]);
    }
    clearForm();
  };

  const [showValue, setShowValue] = useState(false);

  useEffect(() => {
    setCookie(null, "products", JSON.stringify(products), {
      maxAge: 86400 * 28,
      path: "/",
    });

    if (products![0].id != "0") {
      setShowValue(true);
    } else {
      setShowValue(false);
    }
  }, [products]);

  return (
    <div className={styles.App}>
      <div className={styles.main_content}>
        <header className={styles.header}>
          <h1>Mercado Simples</h1>
          <p>O valor de sua compra em tempo real</p>
        </header>

        <div id="display" className={styles.display}>
          <div>Total</div>
          <div>
            {totalCost.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </div>

        <div className={styles.line1}></div>

        <form onSubmit={handleSubmit} className={styles.addProduct}>
          <p>Cadastrar Produto</p>

          <div className={styles.productName}>
            <input
              type="text"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Insira um nome válido"
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              placeholder="Digite o nome do produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.priceAndQuantity}>
            <input
              className={styles.quantity}
              type="number"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Quantidade Inválida (1 -30)"
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              min="1"
              max="30"
              placeholder="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <input
              className={styles.price}
              type="number"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Preço Inválido (0.01 - 5000)"
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              min="0"
              max="5000"
              step=".01"
              placeholder="Preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className={styles.addProductButtons}>
            <button className={styles.clear} type="button" onClick={clearForm}>
              Limpar
            </button>
            <button className={styles.add} type="submit">
              Cadastrar
            </button>
          </div>
        </form>

        <div className={styles.line2}></div>

        <main>
          <h2>Produtos</h2>
          {showValue && (
            <div>
              {products!.map((product: ProductProps) => (
                <div key={product.id} className={styles.productsList}>
                  <div className={styles.nameAndButton}>
                    <div className={styles.gridItemName}>
                      <p>{product.name}</p>
                    </div>

                    <button
                      onClick={() => removeProduct(product.id)}
                      className={styles.removeProduct}
                    >
                      <p>Remover</p>
                    </button>
                  </div>

                  <div className={styles.qntPriceTotal}>
                    <div className={styles.quantity}>
                      <p>{product.quantity}</p>
                    </div>

                    <div className={styles.money}>
                      <p>
                        {Number(product.price).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>

                    <div className={styles.money}>
                      <p>
                        {(
                          Number(product.quantity) * Number(product.price)
                        ).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <div className={styles.footer}>
          <button onClick={removeAllProducts}>Limpar todos os produtos</button>
        </div>
      </div>

      <footer>
        <a
          href="https://www.linkedin.com/in/wallace-martins-ti/"
          target="_blank"
        >
          <p>WCSM &copy; 2022</p>
        </a>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const cookiesProducts =
    Object.values(cookies).length === 0
      ? [{ id: 0, name: "", price: 0, quantity: 0, total: 0 }]
      : JSON.parse(cookies.products);
  return {
    props: {
      serverProducts: cookiesProducts,
    },
  };
};
