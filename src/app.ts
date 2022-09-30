import axios from 'axios';
import * as fs from 'fs';

const cookie = process.argv[2] || "s%============================";
const project = process.argv[3] || "inteltank"
const userName = process.argv[4] || "sawachin"

const fetchPageAmount = 1000
const partition = parseInt(process.argv[5]) || 0
const outputFolder = `data/${project}`

/* =========================================
data取得系
========================================= */

const fetchProject = async (pageAmount: number, partition: number) => {
  const response = await axios.get(
    `https://scrapbox.io/api/pages/${project}`,
    {
      method: 'GET',
      headers: {
        Cookie: `connect.sid=${cookie}`,
        'Content-Type': 'application/json'
      },
      params: {
        limit: pageAmount,
        skip: partition * pageAmount + 1
      }
    }
  )
  return response.data.pages;
}

const fetchPage = async (pageTitle: string) => {
  const pageURL = encodeURI(pageTitle).replace(/\//g, "%2F").replace(/#/g, "%23").replace(/\?/g, "%3F");
  const response = await axios.get(
    `https://scrapbox.io/api/pages/${project}/${pageURL}`,
    {
      method: 'GET',
      headers: {
        Cookie: `connect.sid=${cookie}`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response.data;
}

/* =========================================
logic系
========================================= */


const isCollaborator = (page, userName: string) => {
  let users: Array<string> = [];
  users.push(page.user.name);
  const collaborators = page.collaborators;
  if (collaborators.length !== 0) {
    for (const collaborator of page.collaborators) {
      users.push(collaborator.name);
    }
  }
  return users.includes(userName);
}

function getCollaboratedPage(pageTitle: string) {
  return new Promise((resolve, reject) => {
    fetchPage(pageTitle).then((page) => {
      const newPage = {
        title: page.title,
        created: page.created,
        updated: page.updated,
        id: page.id,
        lines: page.lines
      }

      if (isCollaborator(page, userName)) {
        resolve(newPage);
      } else {
        resolve(null);
      }
    }).catch((error) => {
      resolve(error);
    });
  });
}

/* =========================================
ここから本実装
========================================= */

fetchProject(fetchPageAmount, partition).then((pages) => {
  let promises = [];
  for (const page of pages) {
    promises.push(getCollaboratedPage(page.title));
  }
  Promise.all(promises).then((pagesTmp) => {
    let importJson = { pages: [] }
    for (const pageTmp of pagesTmp) {
      if (pageTmp !== null && pageTmp.title !== undefined) {
        importJson.pages.push(pageTmp);
      }
    }
    fs.writeFileSync(
      `${outputFolder}/import-${partition}.json`,
      JSON.stringify(importJson, null, ' ')
    );

  }).catch((error) => {
    console.log(error.message)
  });
})


