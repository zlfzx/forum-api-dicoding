/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', 
    threadID = 'thread-123', 
    owner = 'user-123', 
    content = 'comment content',
    isDeleted = false,
    date = '2023', 
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadID, owner, content, isDeleted, date],
    };

    await pool.query(query);
  },

  async findCommentByID(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

};

module.exports = CommentsTableTestHelper;
