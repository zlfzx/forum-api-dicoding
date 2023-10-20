const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const DetailReply = require("../../Domains/replies/entities/DetailReply");

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }
    
    async addReply(addReply) {
        const { commentID, owner, content } = addReply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO replies(id, comment_id, owner, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, commentID, owner, content, date],
        };

        const { rows } = await this._pool.query(query);
        return new AddedReply(rows[0]);
    }

    async getReplyCommentByThreadID(threadID) {
        const query = {
            text: `
                SELECT 
                    r.id,
                    r.comment_id,
                    r.content,
                    r.date,
                    u.username,
                    r.is_delete
                FROM replies r
                JOIN users u ON r.owner = u.id 
                JOIN comments c ON r.comment_id = c.id
                WHERE 
                    c.thread_id = $1
                ORDER BY r.date ASC
            `,
            values: [threadID],
        };

        const { rows } = await this._pool.query(query);
        return rows.map((reply) => new DetailReply(reply));
    }

    async checkReplyIsExist(replyID) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyID],
        };

        const { rows } = await this._pool.query(query);
        
        if (!rows.length) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }

    async verifyReplyOwner(replyID, owner) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyID],
        };

        const { rows } = await this._pool.query(query);

        if (!rows.length) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
        
        if (rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async deleteReplyByID(replyID) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1',
            values: [replyID],
        };

        await this._pool.query(query);
    }
}

module.exports = ReplyRepositoryPostgres;