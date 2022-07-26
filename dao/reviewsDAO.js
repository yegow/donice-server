import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }

        try {
            reviews = await conn.db(process.env.DB_NS).collection('reviews');
        } catch (error) {
            console.error(`Unable to establish collection handles in userDAO: ${error}`);
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                text: review,
                restaurant_id: ObjectId(restaurantId),
                date
            };

            console.log('Adding review', reviewDoc);

    
            return await reviews.insertOne(reviewDoc);
        } catch (error) {
            console.error(`Unable to post review: ${error}`)
        }
    }

    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                {user_id: userId, _id: ObjectId(reviewId)},
                {$set: {text: text, date: date}}
            );

            return updateResponse;
        } catch (error) {
            console.error(`Unable to update review: ${error}`);
            return {error};
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId
            });

            return deleteResponse;
        } catch (error) {
            console.error(`Unable to delete review: ${error}`);
            return {error};
        }
    }
}