require("dotenv").config();
const Hapi = require("@hapi/hapi");
const album = require("./api/albums");
const song = require("./api/songs");
const AlbumsService = require("./services/postgres/AlbumsService");
const SongsService = require("./services/postgres/SongsService");
const ClientError = require("./exceptions/ClientError");
const AlbumsValidator = require("./validator/albums");
const SongsValidator = require("./validator/songs");

const init = async () => {
  const albumService = new AlbumsService();
  const songService = new SongsService();
  const server = Hapi.Server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
