/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: "varchar(50) PRIMARY KEY",
    title: "text NOT NULL",
    year: "integer NOT NULL",
    performer: "text NOT NULL",
    genre: "text",
    duration: "integer",
    albumid: {
      type: "varchar(50)",
      references: '"albums"',
      onDelete: "CASCADE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("songs");
};
