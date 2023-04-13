import { memo, useMemo, useState } from "react";
import { getAllPokemons, getAllTypes, getCertainType } from "./apis";
import "./App.css";
import PokeItems from "./PokeItems";
import { useQuery, useQueries } from "react-query";
import { PokemonTypes } from "./typings";

function Pokemon() {
  const [type, setType] = useState<Array<string>>([]);

  // get all types
  const { data: allTypes, isLoading: getTypesLoading } = useQuery(
    "allTypes",
    async () => await getAllTypes()
  );

  // get all pokemons
  const { data: allPokemons, isLoading: getAllLoading } = useQuery(
    "allPokemons",
    async () => await getAllPokemons()
  );

  // get certain types of pokemons
  const useCertainQueries = useQueries(
    type?.map((each) => {
      return {
        queryKey: ["type", each],
        queryFn: () => getCertainType(each),
      };
    })
  );

  const handleClick = (type: string) => {
    const element = document.getElementById(type);
    if (element?.classList.contains("selected")) {
      element?.classList.remove("selected");
      setType((prevState) => prevState.filter((each) => each !== type));
    } else {
      element?.classList.add("selected");
      setType((prevState) => [...prevState, type]);
    }
  };

  let pokeData = useMemo(() => {
    if (!type?.length) {
      return allPokemons;
    }
    if (
      useCertainQueries?.length &&
      useCertainQueries?.every((each) => each.isSuccess)
    ) {
      let customData: Array<PokemonTypes> = [];
      useCertainQueries?.map((each) => {
        const { data, status } = each;
        if (status === "success") {
          data?.map((d: { pokemon: PokemonTypes }) => {
            customData.push(d.pokemon);
          });
        }
      });
      return customData;
    }
  }, [type, allPokemons, useCertainQueries]);

  return (
    <div className="App">
      {getTypesLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          <header className="header">
            <div className="typeHeader">
              <span className="title">Types:</span>
              <div className="types">
                {allTypes?.map((each: PokemonTypes) => (
                  <div
                    className="tag"
                    id={each.name}
                    key={each.url}
                    onClick={() => handleClick(each.name)}
                  >
                    {each.name}
                  </div>
                ))}
              </div>
            </div>
            {!getAllLoading &&
              useCertainQueries?.every((each) => each.isSuccess) && (
                <div className="count">{pokeData?.length} results found.</div>
              )}
          </header>
          {getAllLoading ||
          useCertainQueries?.some((each) => each.isLoading) ? (
            <div className="loading">Loading...</div>
          ) : (
            <PokeItems itemsPerPage={48} items={pokeData} type={type} />
          )}
        </div>
      )}
    </div>
  );
}

export default memo(Pokemon);
