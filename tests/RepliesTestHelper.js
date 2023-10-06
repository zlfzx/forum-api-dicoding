/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool")

const RepliesTestHelper = {
    async addReply({
        id = 'reply-123',
        content = 'reply content',
        owner = 'user-123',
        thread_id = 'thread-123',
        comment_id = 'comment-123',
        is_delete = false,
        date = new Date().toISOString(),
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [id, thread_id, owner, content, is_delete, date, comment_id],
        }

        await pool.query(query)
    },

    async findReplyByID(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        }

        const { rows } = await pool.query(query)

        return rows[0]
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE comment_id IS NOT NULL')
    },
}

module.exports = RepliesTestHelper