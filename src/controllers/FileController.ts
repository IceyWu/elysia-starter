import { Elysia, t } from "elysia";
import { writeFile } from "fs/promises";
import path from "path";

export const FileController = new Elysia()
  .get("/getByIdentifier", async ({ set }) => {
    console.log("🍧-----set-----", set);
    return {
      code: 200,
      data: null,
    };
  })
  .post("/initUpload", async ({ body }) => {
    console.log("🍭-----body-----", body);
    return {
      code: 200,
      data: {
        uploadId: 1,
      },
    };
  })
  .post("/chunkUpload", async ({ body }) => {
    console.log("🍭-----body-----", body);
    return {
      code: 200,
      data: {
        chunkId: body?.partNumber,
      },
    };
  })
  .post("/merge", async ({ body }) => {
    console.log("🍭-----body-----", body);
    return {
      code: 200,
      data: {
        file: "https://github.com/IceyWu/elysia-starter",
      },
    };
  })
  .post(
    "/upload",
    async ({ body }) => {
      if (body?.file) {
        const file = body.file;
        const filePath = path.join(process.cwd(), "upload", file.name);
        try {
          await writeFile(filePath, file.stream());
          const fileUrl = `/upload/${file.name}`; 
          return {
            code: 200,
            data: {
              fileUrl:`http://localhost:${3000}${fileUrl}`
            }
          };
        } catch (error) {
          console.error(`保存文件 ${file.name} 时出错:`, error);
          return {
            code: 500,
            message: "文件保存失败"
          };
        }
      }
      return {
        code: 400, // 没有文件上传，返回 400 错误
        message: "未提供文件"
      };
    },
    {
      body: t.Object({
        file: t.File({ format: "image/*" }),
      }),
    }
  );
