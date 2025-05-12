import Elysia from 'elysia'
import picocolors from 'picocolors'

export const showInfo = (app: Elysia) => {
  const { green, blue, bold, underline } = picocolors
  console.log(
    bold(
      green(
        `👏 欢迎使用${blue(
          '[elysia-starter]',
        )}，如果您感觉不错，记得点击后面链接给个star哦💖 ${underline('https://github.com/IceyWu/elysia-starter')}
        `,
      ),
    ),
  )
  console.log(
    bold(
      green(
        `🎉 ${blue('[Run Port]')}: Elysia is running at ${underline(`${app.server?.hostname}:${app.server?.port}`)}
    `,
      ),
    ),
  )
  console.log(
    bold(
      green(
        `📄 ${blue('[API-doc]')}: ${underline(`http://localhost:${app.server?.port}/reference`)}
    `,
      ),
    ),
  )
  console.log(
    bold(
      green(
        `🖼️ ${blue('[File-serve]')}: ${underline(`http://localhost:${app.server?.port}/upload/avatar.jpg`)}
    `,
      ),
    ),
  )
}
