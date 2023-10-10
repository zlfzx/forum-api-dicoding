/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool")

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123',
        content = 'reply content',
        owner = 'user-123',
        comment_id = 'comment-123',
        is_delete = false,
        date = new Date().toISOString(),
    }) {
        const query = {
            text: 'INSERT INTO replies(id, comment_id, owner, content, is_delete, date) VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, comment_id, owner, content, is_delete, date],
        }

        await pool.query(query)
    },

    async findReplyByID(id) {
        const query = {
            text: 'SELECT id, comment_id, owner, content, is_delete FROM replies WHERE id = $1',
            values: [id],
        }

        const { rows } = await pool.query(query)

        return rows
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1')
    },
}

module.exports = RepliesTableTestHelper