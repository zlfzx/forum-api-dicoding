const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }
 
    async addThread(thread) {
        const { title, body, owner } = thread;
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();
 
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, owner',
            values: [id, title, body, owner, date],
        };
 
        const { rows } = await this._pool.query(query);
        return rows[0];
    }

    async getThreadByID(id) {
        const query = {
            text: `
                SELECT 
                    t.id,
                    t.title,
                    t.body,
                    t.date,
                    u.username 
                FROM threads t
                JOIN users u ON t.owner = u.id 
                WHERE 
                    t.id = $1
            `,
            values: [id],
        };
 
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;