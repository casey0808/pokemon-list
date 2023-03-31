import { useRequest } from "ahooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllPokemons, getAllTypes, getCertainType } from "./apis";
import "./App.css";
import { TTypes } from "./constants";
import ReactPaginate from "react-paginate";
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
      refreshDeps: [type],
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
        <div className="count">{pokeData?.length} results found.</div>
      </header>
      {getAllLoading || getCertainLoading ? (
        <>Loading</>
      ) : (
        <PokeItems itemsPerPage={48} items={pokeData} />
      )}
    </div>
  );
}

export default App;
