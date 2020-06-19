import React from 'react';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

class Pagination extends React.Component {
  render() {
    let itemsPerPage = this.props.itemsPerPage;
    if (itemsPerPage === 0)
        itemsPerPage = 20;

    const pageCount = Math.ceil(this.props.totalItems / itemsPerPage);
    return (
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.props.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    );
  }
}

Pagination.propTypes = {
    handlePageClick: PropTypes.func.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired
}

export default Pagination;
