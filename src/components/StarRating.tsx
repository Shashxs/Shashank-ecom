import React from 'react';
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import { StarRatingProps } from '../types/types';

const StarRating: React.FC<StarRatingProps> = ({ rating = 0}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <AiFillStar key={index} className="text-yellow-500" />
      ))}
      {halfStar && <AiTwotoneStar className="text-yellow-500" />}
      {[...Array(emptyStars)].map((_, index) => (
        <AiOutlineStar key={index} className="text-yellow-500" />
      ))}
    </div>
  );
};

export default StarRating;