
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';

type Review = {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string | null;
};

interface ReviewsListProps {
  productId: string;
  refreshTrigger: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        throw reviewsError;
      }

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setAverageRating(0);
        setLoading(false);
        return;
      }

      // Calculate average rating
      const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviewsData.length;
      setAverageRating(avgRating);

      // Get user profiles for each review
      const reviewsWithUserInfo = await Promise.all(
        reviewsData.map(async (review) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', review.user_id)
            .single();

          return {
            ...review,
            user_name: profileData?.full_name || 'Anonymous User'
          };
        })
      );

      setReviews(reviewsWithUserInfo);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-4">Loading reviews...</div>;
  }

  return (
    <div>
      {reviews.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">
              {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id}>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {review.user_name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.user_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex mt-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && <p>{review.comment}</p>}
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
