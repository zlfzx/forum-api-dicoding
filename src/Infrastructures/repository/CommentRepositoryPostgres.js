const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const DetailComment = require("../../Domains/comments/entities/DetailComment");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(addComment) {
        const { content, threadID, owner } = addComment;
        const id = `comment-${this._idGenerator()}`;
        const is_delete = false;
        const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, threadID, owner, content, is_delete, date ],
        };

        const { rows } = await this._pool.query(query);
        return new AddedComment({ ...rows[0] });
    }

    async checkCommentIsExist(id) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [id],
        };

        const { rows } = await this._pool.query(query);

        if (!rows.length) {
            throw new NotFoundError('komentar tidak ditemukan');
        }

        return rows[0].id;
    }

    async verifyCommentOwner(id, owner) {
        const query = {
            text: 'SELECT owner FROM comments WHERE id = $1',
            values: [id],
        };

        const { rows } = await this._pool.query(query);

        if (!rows.length) {
            throw new NotFoundError('komentar tidak ditemukan');
        }

        if (rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async deleteCommentByID(id) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id',
            values: [id],
        };

        const { rows } = await this._pool.query(query);
        
        if (!rows.length) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }

    async getCommentsByThreadID(threadID) {
        const query = {
            text: `
                SELECT 
                    c.id,
                    c.content,
                    c.date,
                    u.username,
                    c.is_delete
                FROM comments c
                JOIN users u ON c.owner = u.id 
                WHERE 
                    c.thread_id = $1
                    AND c.comment_id IS NULL
                ORDER BY c.date ASC
            `,
            values: [threadID],
        };

        const { rows } = await this._pool.query(query);
        return rows.map((comment) => new DetailComment({
            ...comment,
        }));
    }
}

module.exports = CommentRepositoryPostgres;