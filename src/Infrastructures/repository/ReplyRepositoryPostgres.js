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
        const { threadID, owner, content, commentID } = addReply;
        const id = `reply-${this._idGenerator()}`;
        const is_delete = false;
        const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
            values: [id, threadID, owner, content, is_delete, date, commentID ],
        };

        const { rows } = await this._pool.query(query);
        return new AddedReply({ ...rows[0] });
    }

    async getReplyCommentByThreadID(threadID) {
        const query = {
            text: `
                SELECT 
                    c.id,
                    c.comment_id,
                    c.content,
                    c.date,
                    u.username,
                    c.is_delete
                FROM comments c
                JOIN users u ON c.owner = u.id 
                WHERE 
                    c.thread_id = $1
                    AND c.comment_id IS NOT NULL
                ORDER BY c.date ASC
            `,
            values: [threadID],
        };

        const { rows } = await this._pool.query(query);
        return rows.map((reply) => new DetailReply({
            ...reply,
        }));
    }

    async checkReplyIsExist(replyID) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [replyID],
        };

        const { rows } = await this._pool.query(query);
        
        if (!rows.length) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }

    async verifyReplyOwner(replyID, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
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
            text: 'UPDATE comments SET is_delete = true WHERE id = $1',
            values: [replyID],
        };

        await this._pool.query(query);
    }
}

module.exports = ReplyRepositoryPostgres;