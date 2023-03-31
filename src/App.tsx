import { useRequest } from "ahooks";
import React, { memo, useState } from "react";
import { getAllPokemons, getAllTypes, getCertainType } from "./apis";
import "./App.css";
import { TTypes } from "./constants";
import PokeItems from "./PokeItems";

function App() {
  const [type, setType] = useState<null | string>(null);
  const [pokeData, setPokeData] = useState([]);

  const { data: allTypes, loading: getTypesLoading } = useRequest(
    async () => await getAllTypes(),
    {
      refreshDeps: [],
    }
  );

  const { data: allPokemons, loading: getAllLoading } = useRequest(
    async () => await getAllPokemons(),
    {
      refreshDeps: [],
      onSuccess: (data) => {
        setPokeData(data);
      },
    }
  );

  const {
    data: certainType,
    run: getType,
    loading: getCertainLoading,
  } = useRequest(async (type) => await getCertainType(type), {
    refreshDeps: [type],
    manual: true,
    onSuccess: (data) => {
      const arr = data.map((each: any) => each?.pokemon);
      setPokeData(arr);
    },
  });

  const handleClick = (type: string) => {
    const element = document.getElementById(type);
    if (element?.classList.contains("selected")) {
      element?.classList.remove("selected");
      setType(null);
      setPokeData(allPokemons);
    } else {
      const allElements = document.querySelectorAll(".tag");
      allElements?.forEach((each) => each?.classList.remove("selected"));
      element?.classList.add("selected");
      setType(type);
      getType(type);
    }
  };

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
                {allTypes?.map((each: TTypes) => (
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
            {!getAllLoading && !getCertainLoading && (
              <div className="count">{pokeData?.length} results found.</div>
            )}
          </header>
          {getAllLoading || getCertainLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <PokeItems itemsPerPage={48} items={pokeData} />
          )}
        </div>
      )}
    </div>
  );
}

export default memo(App);
