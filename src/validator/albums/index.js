const InvariantError = require("../../exceptions/ClientError");
const { AlbumPayloadSchema } = require("./schema");

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const result = AlbumPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = AlbumsValidator;
