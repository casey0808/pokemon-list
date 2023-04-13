import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./PokeItems.css";

function Items({ currentItems }: any) {
  const imgUrlBase =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
  return (
    <div className="items">
      {currentItems?.map((item: any) => {
        const url = item?.url;
        const arr = url?.trim().split(/\/+/);
        const index = arr[arr?.length - 2];
        return (
          <div className="item" key={item.url}>
            <img src={`${imgUrlBase}/${index}.png`} className="img" alt={item.name} />
            <p>{item?.name}</p>
          </div>
        );
      })}
    </div>
  );
}

function PokeItems({
  itemsPerPage,
  items,
  type
}: {
  itemsPerPage: number;
  items: any;
  type: Array<string>;
}) {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // if type changes, reset page num
  useEffect(() => {
    setItemOffset(0);
    const element = document.querySelector('.prevBtn');
    element?.classList.add('disabled')
  }, [type])

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items?.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        // breakLabel="..."
        nextLabel="next"
        onPageChange={handlePageClick}
        // pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="prev"
        marginPagesDisplayed={0}
        renderOnZeroPageCount={null}
        pageClassName="pageNum"
        breakClassName="pageNum"
        previousClassName="prevBtn"
        nextClassName="nextBtn"
        className="btnRow"
      />
    </>
  );
}

export default PokeItems;
