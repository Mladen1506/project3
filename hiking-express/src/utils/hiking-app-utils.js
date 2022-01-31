export const selectTourById = (tourId, tours) => {
  let selected = false; // return false if tour is not found
  if (Array.isArray(tours)) {
    tours.forEach((item) => {
      if (item._id === tourId) {
        selected = item; // will return single tour
      }
    });
  }
  return selected;
};

export const selectAllReviewsForSingleTour = (tourId, reviews) => {
  let selected = [];
  if (Array.isArray(reviews)) {
    selected = reviews.filter((item) => {
      if (item.tour === tourId) {
        return true;
      }
      return false;
    });
  }
  return selected;
};

export const calculateAverageRating = (reviews) => {
  let count = 0;
  let total = 0;
  if (Array.isArray(reviews)) {
    reviews.forEach((item) => {
      // console.log('counting rating');
      // console.log(item);
      count++
      if (item.rating && item.rating > 0) {
        total += item.rating;
      }
    });
  }
  let result = 0;
  if (count > 0) {
    result = total / count;
  }
  return result;
};
