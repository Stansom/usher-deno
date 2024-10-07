import React, { useEffect, useState } from "react";
import * as routing from "../routing";
import { GoMain } from "../components/goMain";

function GoPokemons() {
  return (
    <button onClick={() => routing.pushState("/pokemons")}>Go Pokemons</button>
  );
}

export function Houses() {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("http://localhost:3030/houses")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => console.error("Can't fetch data", "houses"));
  }, []);
  return (
    <div>
      <GoMain />
      <GoPokemons />

      {data && data.map((h, i) => <div key={i}>{h.name}</div>)}
    </div>
  );
}
