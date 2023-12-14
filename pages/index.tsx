import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import localFont from "next/font/local";

const myFont = localFont({
  src: "./Tickerbit-mono.otf",
  display: "swap",
});

const lack = localFont({
  src: "./lack-regular.otf",
  display: "swap",
});

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        ingredients: ingredients,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();
    setRecipe([...data.recipes, ...recipe]);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Plantabot - AI vegan recipes generator</title>
        <meta name="description" content="Create recipes with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main
        className={`${lack.className} min-h-screen p-10 bg-black text-white`}
      >
        <div className="text-7xl text-center">🌱</div>
        <h1 className="text-7xl text-center">
          Planta<span className={`${myFont.className} text-primary-100`}>bot</span>
        </h1>
        <h2 className="text-xl p-2 text-center">
          Generate vegan cooking ideas based on ingredients you have, generated
          with <span className={`${myFont.className} text-primary-100`}>AI</span>
        </h2>
        <form className="p-2 text-center" onSubmit={handleSubmit}>
          <div className={myFont.className}>
            <label htmlFor="ingredient">
				 Type ingredients: 
              <input
                type="text"
                value={ingredients}
                className="p-2 m-2 bg-transparent border-2 border-b-white"
				onChange={(event) => setIngredients(event.target.value)}
              />
            </label>
			<button
              type="submit"
              className={
                "bg-primary-100 text-black uppercase p-2 m-2 rounded-xl hover:bg-green-900" +
                (ingredients.length === 0
                  ? " opacity-50 cursor-not-allowed"
                  : "")
              }
              disabled={ingredients.length === 0 || loading}
            >
              {loading ? "Cooking ideas..." : "Heat me up!"}
            </button>
          </div>
        </form>
        <div className="mt-5">
		
          {recipe &&
            recipe.map((recipe, index) => (
                <p className="">{recipe}</p>
            ))}
        </div>
      </main>
    </>
  );
}
