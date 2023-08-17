import React from "react";
import { Pagination, PaginationItem } from "@mui/material";

const CustomPagination = ({ pages, currentPage, handlePageChange }) => {
  return (
    <Pagination
      className="d-flex justify-content-center"
      color="primary"
      count={pages}
      page={currentPage}
      onChange={handlePageChange}
      renderItem={(item) => <PaginationItem component={"div"} {...item} />}
    />
  );
};

export default CustomPagination;