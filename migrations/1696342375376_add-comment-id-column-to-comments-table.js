/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('comments', {
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: false,
        },
    });

    pgm.addConstraint('comments', 'fk_comments.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('comments', 'fk_comments.comment_id_comments.id');

    pgm.dropColumns('comments', 'comment_id');
};
