import type { NextApiRequest, NextApiResponse } from "next";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ingredients } = req.body as {
    ingredients: string[];
  };

  const prompt = `I have these ingredients: ${ingredients}. I would like 1 vegan cooking recipe using all the ingredients, divide them by the word 'recipe'. Try to make these original and edgy.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "ft:gpt-3.5-turbo-1106:personal::8UDQWx8e",
      messages: [{ content: prompt, role: "user" }],
    }),
  });

  const data = await response.json();

  const recipes = data.choices[0].message.content
    .split("\n")
    .filter((line: string | any[]) => line.length > 0);

  res.status(200).json({
    recipes: recipes,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await post(req, res);
      break;
    default:
      res.status(405).end();
  }
};

export default handler;
