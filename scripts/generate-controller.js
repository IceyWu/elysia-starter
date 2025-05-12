import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'
import consola from 'consola'
import pc from 'picocolors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function formatControllerName(raw) {
  let name = raw.replace(/[^a-zA-Z0-9]/g, '')
  name = name.charAt(0).toUpperCase() + name.slice(1)
  if (!name.endsWith('Controller')) {
    name += 'Controller'
  }
  return name
}

function getGroupPath(controllerName) {
  return '/' + controllerName.replace(/Controller$/, '').toLowerCase()
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(pc.bold(pc.green('请输入 Controller 名称（如 User、File）：')), (rawName) => {
  if (!rawName.trim()) {
    consola.error(pc.red('名称不能为空'))
    rl.close()
    process.exit(1)
  }
  const controllerName = formatControllerName(rawName)
  const fileName = `${controllerName}.ts`
  const controllerDir = path.resolve(__dirname, '../src/controllers')
  const filePath = path.join(controllerDir, fileName)
  const tagName = controllerName.replace(/Controller$/, '')

  // 读取模板文件并替换变量
  const tplPath = path.resolve(__dirname, './templates/controller.tpl')
  let template = fs.readFileSync(tplPath, 'utf-8')
  template = template
    .replace(/{{controllerName}}/g, controllerName)
    .replace(/{{tagName}}/g, tagName)

  if (!fs.existsSync(controllerDir)) {
    fs.mkdirSync(controllerDir, { recursive: true })
    consola.success(pc.green('已创建 controllers 目录'))
  }

  if (fs.existsSync(filePath)) {
    consola.error(pc.red(`${fileName} 已存在`))
    rl.close()
    process.exit(1)
  }

  fs.writeFileSync(filePath, template)
  consola.success(pc.green(`已创建: src/controllers/${fileName}`))

  // 修改 index.ts 自动引入和注册
  const indexPath = path.resolve(__dirname, '../src/index.ts')
  let indexContent = fs.readFileSync(indexPath, 'utf-8')

  // 1. 添加 import
  const importLine = `import { ${controllerName} } from "./controllers/${controllerName}";`
  if (!indexContent.includes(importLine)) {
    const importEnd = indexContent.lastIndexOf('import')
    const firstNonImport = indexContent.indexOf('\n', indexContent.indexOf('\n', importEnd) + 1)
    indexContent = indexContent.slice(0, firstNonImport + 1) + importLine + '\n' + indexContent.slice(firstNonImport + 1)
    consola.info(pc.blue(`已自动添加 import 到 index.ts`))
  }

  // 2. 添加 swagger tag
  const tagLine = `{ name: "${tagName}", description: "${tagName} endpoints" },`
  const swaggerTagMatch = indexContent.match(/tags:\s*\[([\s\S]*?)\]/)
  if (swaggerTagMatch && !swaggerTagMatch[1].includes(`name: "${tagName}"`)) {
    const tagsStart = swaggerTagMatch.index + swaggerTagMatch[0].indexOf('[') + 1
    indexContent = indexContent.slice(0, tagsStart) + '\n        ' + tagLine + indexContent.slice(tagsStart)
    consola.info(pc.blue(`已自动添加 swagger tag`))
  }

  // 3. 注入 app.group
  const groupLine = `app.group("${getGroupPath(controllerName)}", (route) => route.use(${controllerName}));`
  if (!indexContent.includes(groupLine)) {
    let insertPos = indexContent.lastIndexOf('app.group')
    if (insertPos === -1) insertPos = indexContent.lastIndexOf('app.use')
    if (insertPos !== -1) {
      insertPos = indexContent.indexOf('\n', insertPos) + 1
      indexContent = indexContent.slice(0, insertPos) + groupLine + '\n' + indexContent.slice(insertPos)
    } else {
      const appDef = indexContent.indexOf('const app')
      const appDefEnd = indexContent.indexOf('\n', appDef) + 1
      indexContent = indexContent.slice(0, appDefEnd) + groupLine + '\n' + indexContent.slice(appDefEnd)
    }
    consola.info(pc.blue(`已自动以 app.group 注册到 index.ts`))
  }

  fs.writeFileSync(indexPath, indexContent)
  consola.success(pc.bgGreen(pc.black(' 全部操作完成！ ')))
  rl.close()
})