/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async findThreadByID(id) {
        const query = {
            text: 'SELECT id, title, body, owner FROM threads WHERE id = $1',
            values: [id],
        };

        const { rows } = await pool.query(query);
        return rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    }
}

module.exports = ThreadsTableTestHelper;