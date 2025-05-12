import { Elysia } from "elysia";

export const {{controllerName}} = new Elysia()
  // 查询列表
  .get("/", () => ({
    success: true,
    message: "获取{{tagName}}列表成功",
    data: [],
  }), {
    tags: ["{{tagName}}"]
  })
  // 查询单个
  .get("/:id", ({ params }) => ({
    success: true,
    message: "获取{{tagName}}详情成功",
    data: { id: params.id },
  }), {
    tags: ["{{tagName}}"]
  })
  // 新增
  .post("/", ({ body }) => ({
    success: true,
    message: "创建{{tagName}}成功",
    data: body,
  }), {
    tags: ["{{tagName}}"]
  })
  // 更新
  .put("/:id", ({ params, body }) => ({
    success: true,
    message: "更新{{tagName}}成功",
    data: { id: params.id, ...body },
  }), {
    tags: ["{{tagName}}"]
  })
  // 删除
  .delete("/:id", ({ params }) => ({
    success: true,
    message: "删除{{tagName}}成功",
    data: { id: params.id },
  }), {
    tags: ["{{tagName}}"]
  });