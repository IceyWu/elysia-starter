import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { UserController } from "./controllers/UserController";
import { AuthController } from "./controllers/AuthController";
import { isAuthenticated } from "./utils/isAuthenticated";
import { showInfo } from './utils/info'
const app = new Elysia();

app.get("/", () => "Hello Elysia Starter");
app.use(
  swagger({
    path: "/reference",
    scalarCDN: "https://fastly.jsdelivr.net/npm/@scalar/api-reference",
    documentation: {
      info: {
        title: "Elysia Starter",
        description: "Elysia Starter API Documentation",
        version: "0.0.1",
      },
      tags: [
        { name: "App", description: "General endpoints" },
        { name: "Auth", description: "Authentication endpoints" },
      ],
    },
  })
);
app.use(AuthController);
app.group("/user", (route) => route.use(isAuthenticated).use(UserController));

app.listen(3000);

// show info
showInfo(app)
