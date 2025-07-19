const InvariantError = require("../../exceptions/ClientError");
const { SongPayloadSchema } = require("./schema");

const SongsValidator = {
  validateSongPayload: (payload) => {
    const result = SongPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = SongsValidator;
