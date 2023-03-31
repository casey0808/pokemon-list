export const baseUrl = "https://pokeapi.co/api/v2";

export const getAllTypes = async () => {
  const res = await (
    await fetch(`${baseUrl}/type`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  ).json();
  return res?.results;
};

export const getAllPokemons = async () => {
  const res = await (
    await fetch(`${baseUrl}/pokemon?limit=1200`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  ).json();
  return res?.results;
};

export const getCertainType = async (type: string | null) => {
  const res = await (
    await fetch(`${baseUrl}/type/${type}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  ).json();
  return res?.pokemon;
};