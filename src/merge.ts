import * as fs from 'fs'
const project = process.argv[3] || "inteltank"
const rawdDataFolder = `data/${project}`
const outputFolder = 'data'

fs.readdir(project, (_, files) => {
  console.log(files);
  let importJson = {
    pages: []
  }
  for (const fileName of files) {
    if (fileName === '.DS_Store') {
      continue;
    }
    const rawdata = fs.readFileSync(`${rawdDataFolder}/${fileName}`, 'utf8');
    const json = JSON.parse(rawdata);
    const pages = json.pages;
    importJson.pages.push(...pages);
  }
  fs.writeFileSync(
    `${outputFolder}/${project}-import.json`,
    JSON.stringify(importJson, null, ' ')
  );
})

