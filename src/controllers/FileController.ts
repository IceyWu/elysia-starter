import { Elysia } from "elysia";


export const FileController = new Elysia()
  .get("/getByIdentifier", async ({ set }) => {
    console.log('🍧-----set-----', set);
    return {
      code: 200,
      data: null,
    };
  })
  .post("/initUpload", async ({body}) => {
    console.log('🍭-----body-----', body);
    return {
      code: 200,
      data: {
        uploadId: 1,
      },
    };
  })
  .post("/chunkUpload", async ({body}) => {
    console.log('🍭-----body-----', body);
    return {
      code: 200,
      data: {
        chunkId: body?.partNumber,
      },
    };
  })
  .post("/merge", async ({body}) => {
    console.log('🍭-----body-----', body);
    return {
      code: 200,
      data: {
        file:'https://github.com/IceyWu/elysia-starter'
      },
    };
  })
  .post("/upload", async ({body}) => {
    console.log('🍭-----body-----', body);
    return {
      code: 200,
      data: {
        file:'https://github.com/IceyWu/elysia-starter'
      },
    };
  })

