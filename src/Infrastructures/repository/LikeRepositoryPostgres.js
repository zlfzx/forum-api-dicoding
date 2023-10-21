const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addLike(payload) {
        const { commentID, owner } = payload;
        const id = `like-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id, owner',
            values: [id, commentID, owner],
        };

        const { rows } = await this._pool.query(query);
        return rows[0];
    }

    async deleteLike({ commentID, owner }) {
        const query = {
            text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2 RETURNING id, owner',
            values: [commentID, owner],
        };

        const { rows } = await this._pool.query(query);
        return rows[0];
    }

    async getLikeCount(commentID) {
        const query = {
            text: 'SELECT COUNT(*)::int FROM likes WHERE comment_id = $1',
            values: [commentID],
        };

        const { rows } = await this._pool.query(query);
        return rows[0].count;
    }

    async checkLike(commentID, owner) {
        const query = {
            text: 'SELECT id, owner FROM likes WHERE comment_id = $1 AND owner = $2',
            values: [commentID, owner],
        };

        const { rows } = await this._pool.query(query);
        return rows[0];
    }
}

module.exports = LikeRepositoryPostgres;