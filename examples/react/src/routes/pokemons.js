import { useEffect, useState } from "react";
import React from "react";
import { GoMain } from "../components/goMain";

export function Pokemons() {
  let [data, setData] = useState();
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  if (data && data.results.length > 0) {
    return (
      <div>
        <GoMain />
        {data.results.map((h, i) => (
          <div key={i}>{h.name}</div>
        ))}
      </div>
    );
  }
}
