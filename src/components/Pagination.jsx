export default function Pagination({
  search,
  pages,
  searchPages,
  searchPage,
  setSearchPage,
  page,
  setPage,
}) {
  const onNextPage = async () => {
    window.scrollTo(0, 0);
    if (search === false) {
      if (page < pages) {
        setPage(page + 1);
      }
    } else {
      if (searchPage < searchPages) {
        setSearchPage(searchPage + 1);
      }
    }
  };

  const onPrevPage = async () => {
    window.scrollTo(0, 0);
    if (search === false) {
      if (page > 1) {
        setPage(page - 1);
      }
    } else {
      if (searchPage > 1) {
        setSearchPage(searchPage - 1);
      }
    }
  };

  return (
    <div className="d-flex justify-content-between mb-5 mt-5">
      <button onClick={onPrevPage} className="btn btn-outline-secondary btn-sm">
        <i className="bi bi-arrow-left"></i>
      </button>
      <span style={{ color: 'white' }}>
        Page: {search === false ? page : searchPage}
      </span>
      <button
        onClick={onNextPage}
        className="btn btn-outline-secondary btn-sm "
        type="button"
      >
        <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  );
}
