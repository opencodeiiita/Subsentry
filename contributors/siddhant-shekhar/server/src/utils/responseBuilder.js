export const successResponse = ({
  message = 'Success',
  data = null,
  meta = null,
}) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

export const errorResponse = ({
  message = 'An error occurred',
  code = 'ERROR',
  details = null,
}) => {
  const response = {
    success: false,
    message,
    error: {
      code,
    },
  };

  if (details !== null) {
    response.error.details = details;
  }

  return response;
};

export const buildPaginationMeta = ({ page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);

  return {
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
