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
}

module.exports = ThreadRepositoryPostgres;