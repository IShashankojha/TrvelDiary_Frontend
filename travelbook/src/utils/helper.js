import ADD_STORY_IMG from '../assets/images/AddStory.svg';
import NO_SEARCH_IMG from '../assets/images/search.svg';
import NO_FILTER_IMG from '../assets/images/filter.svg';

export const validateEmail = (email) => {
  // Regular expression to validate email addresses
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getinitials = (name) => {
  if (!name) return ''; // Return empty if the name is not provided
  const words = name.split(' ');
  let initials = '';
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase(); // Convert initials to uppercase
};

export const getEmptyCardMessage = (filterType) => {
  switch (filterType) {
    case 'search':
      return `Oops! No stories found matching your search`;
    case 'date':
      return `No stories found for this date range`;
    default:
      return `Start Creating Your First Travel Story! Click the 'Add' button to write down your thoughts, ideas, and memories. Let's get started.`;
  }
};

export const getEmptyCardImg = (filterType) => {
  switch (filterType) {
    case 'search':
      return NO_SEARCH_IMG;
    case 'date':
      return NO_FILTER_IMG;
    default:
      return ADD_STORY_IMG;
  }
};
